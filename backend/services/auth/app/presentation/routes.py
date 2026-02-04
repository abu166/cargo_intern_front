from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.domain import schemas
from app.infrastructure.db import create_session_factory, Base
from app.infrastructure import repositories
from app.application import services
from shared.config import get_env
from shared.security import create_access_token, decode_token


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


DATABASE_URL = get_env("DATABASE_URL")
JWT_SECRET = get_env("JWT_SECRET")
JWT_ALGORITHM = get_env("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(get_env("JWT_EXPIRE_MINUTES", "120"))

engine, SessionLocal = create_session_factory(DATABASE_URL)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_token(token, JWT_SECRET, JWT_ALGORITHM)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = repositories.get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_roles(required: set[str]):
    def _checker(user = Depends(get_current_user)):
        roles = set(filter(None, user.roles.split(",")))
        if not required.intersection(roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return user
    return _checker


@router.post("/auth/login", response_model=schemas.Token)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = services.authenticate_user(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": user.username, "roles": user.roles}, JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRE_MINUTES)
    services.log_action(db, user.id, "login")
    return schemas.Token(access_token=token)


@router.get("/auth/me", response_model=schemas.UserOut)
def me(user = Depends(get_current_user)):
    return schemas.UserOut(
        id=user.id,
        username=user.username,
        full_name=user.full_name,
        roles=list(filter(None, user.roles.split(","))),
        is_active=user.is_active,
        created_at=user.created_at,
    )


@router.post("/auth/logout")
def logout(user = Depends(get_current_user), db: Session = Depends(get_db)):
    services.log_action(db, user.id, "logout")
    return {"status": "ok"}


@router.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db), _user = Depends(require_roles({"ADMIN"}))):
    users = repositories.list_users(db)
    return [schemas.UserOut(
        id=u.id,
        username=u.username,
        full_name=u.full_name,
        roles=list(filter(None, u.roles.split(","))),
        is_active=u.is_active,
        created_at=u.created_at,
    ) for u in users]


@router.post("/users", response_model=schemas.UserOut)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db), _user = Depends(require_roles({"ADMIN"}))):
    user = services.register_user(db, payload.username, payload.password, payload.full_name, payload.roles)
    services.log_action(db, _user.id, "create_user", f"user_id={user.id}")
    return schemas.UserOut(
        id=user.id,
        username=user.username,
        full_name=user.full_name,
        roles=list(filter(None, user.roles.split(","))),
        is_active=user.is_active,
        created_at=user.created_at,
    )


@router.put("/users/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, payload: schemas.UserUpdate, db: Session = Depends(get_db), _user = Depends(require_roles({"ADMIN"}))):
    user = repositories.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.roles is not None:
        user.roles = ",".join(payload.roles)
    if payload.is_active is not None:
        user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    services.log_action(db, _user.id, "update_user", f"user_id={user.id}")
    return schemas.UserOut(
        id=user.id,
        username=user.username,
        full_name=user.full_name,
        roles=list(filter(None, user.roles.split(","))),
        is_active=user.is_active,
        created_at=user.created_at,
    )


@router.post("/clients", response_model=schemas.ClientOut)
def create_client(payload: schemas.ClientCreate, db: Session = Depends(get_db), _user = Depends(require_roles({"AGENT", "ADMIN", "OPERATOR"}))):
    client = services.register_client(db, payload.full_name, payload.document_id, payload.phone)
    services.log_action(db, _user.id, "create_client", f"client_id={client.id}")
    return schemas.ClientOut(
        id=client.id,
        full_name=client.full_name,
        document_id=client.document_id,
        phone=client.phone,
        created_at=client.created_at,
    )


@router.get("/clients", response_model=list[schemas.ClientOut])
def list_clients(db: Session = Depends(get_db), _user = Depends(require_roles({"AGENT", "ADMIN", "OPERATOR"}))):
    clients = repositories.list_clients(db)
    return [schemas.ClientOut(
        id=c.id,
        full_name=c.full_name,
        document_id=c.document_id,
        phone=c.phone,
        created_at=c.created_at,
    ) for c in clients]


@router.get("/audit/logs", response_model=list[schemas.AuditOut])
def audit_logs(db: Session = Depends(get_db), _user = Depends(require_roles({"ADMIN"}))):
    logs = repositories.list_audit(db)
    return [schemas.AuditOut(
        id=l.id,
        user_id=l.user_id,
        action=l.action,
        details=l.details,
        created_at=l.created_at,
    ) for l in logs]
