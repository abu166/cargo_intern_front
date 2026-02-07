from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.db import get_db
from app.models import User, Employee, Shipment
from app.socket import sio


router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def _user_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "company": user.company,
        "deposit_balance": user.deposit_balance,
        "contract_number": user.contract_number,
        "phone": user.phone,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


def _employee_dict(emp: Employee) -> dict:
    return {
        "id": emp.id,
        "name": emp.name,
        "email": emp.email,
        "role": emp.role,
        "station": emp.station,
        "created_at": emp.created_at.isoformat() if emp.created_at else None,
        "status": "active",
    }


def _shipment_dict(shipment: Shipment) -> dict:
    return {
        "id": shipment.id,
        "client_id": shipment.client_id,
        "client_name": shipment.client_name,
        "client_email": shipment.client_email,
        "from_station": shipment.from_station,
        "to_station": shipment.to_station,
        "status": shipment.status,
        "departure_date": shipment.departure_date,
        "weight": shipment.weight,
        "dimensions": shipment.dimensions,
        "description": shipment.description,
        "value": shipment.value,
        "created_at": shipment.created_at.isoformat() if shipment.created_at else None,
    }


@router.post("/auth/register")
async def register(payload: dict, db: Session = Depends(get_db)):
    name = payload.get("name")
    email = payload.get("email")
    password = payload.get("password")
    role = payload.get("role") or "individual"
    company = payload.get("company")
    phone = payload.get("phone")

    if not name or not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing required fields")

    existing = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(
        id=str(int(datetime.utcnow().timestamp() * 1000)),
        name=name,
        email=email,
        password=_hash_password(password),
        role=role,
        company=company,
        phone=phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_dict(user)


@router.post("/auth/login")
async def login(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing credentials")

    staff = db.execute(select(Employee).where(Employee.email == email)).scalar_one_or_none()
    if staff and _verify_password(password, staff.password):
        return _employee_dict(staff)

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user and _verify_password(password, user.password):
        return _user_dict(user)

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")


@router.get("/shipments")
async def list_shipments(db: Session = Depends(get_db)):
    shipments = db.execute(select(Shipment).order_by(Shipment.created_at.desc())).scalars().all()
    return [_shipment_dict(s) for s in shipments]


@router.get("/shipments/by-station/{station}")
async def list_shipments_by_station(station: str, db: Session = Depends(get_db)):
    shipments = db.execute(
        select(Shipment)
        .where(Shipment.from_station == station)
        .order_by(Shipment.created_at.desc())
    ).scalars().all()
    return [_shipment_dict(s) for s in shipments]


@router.patch("/shipments/{shipment_id}/status")
async def update_shipment_status(shipment_id: str, payload: dict, db: Session = Depends(get_db)):
    status_value = payload.get("status")
    if not status_value:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing status")

    shipment = db.get(Shipment, shipment_id)
    if not shipment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found")

    shipment.status = status_value
    db.commit()
    db.refresh(shipment)

    await sio.emit("shipment-updated", _shipment_dict(shipment), room=f"station:{shipment.from_station}")
    return _shipment_dict(shipment)


@router.post("/shipments")
async def create_shipment(payload: dict, db: Session = Depends(get_db)):
    required_fields = ["client_id", "from_station", "to_station"]
    for field in required_fields:
        if not payload.get(field):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Missing {field}")

    shipment_id = f"SH-{str(int(datetime.utcnow().timestamp() * 1000))[-6:]}"
    shipment = Shipment(
        id=shipment_id,
        client_id=payload.get("client_id"),
        client_name=payload.get("client_name"),
        client_email=payload.get("client_email"),
        from_station=payload.get("from_station"),
        to_station=payload.get("to_station"),
        status="В пути",
        weight=payload.get("weight"),
        dimensions=payload.get("dimensions"),
        description=payload.get("description"),
        value=payload.get("value"),
        departure_date=payload.get("departure_date") or datetime.utcnow().isoformat(),
    )
    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    await sio.emit("new-shipment", _shipment_dict(shipment), room=f"station:{shipment.from_station}")
    return _shipment_dict(shipment)


@router.get("/admin/employees")
async def list_employees(db: Session = Depends(get_db)):
    employees = db.execute(select(Employee).order_by(Employee.created_at.desc())).scalars().all()
    return [_employee_dict(emp) for emp in employees]


@router.post("/admin/employees")
async def create_employee(payload: dict, db: Session = Depends(get_db)):
    name = payload.get("name")
    email = payload.get("email")
    password = payload.get("password")
    role = payload.get("role")
    station = payload.get("station")

    if not name or not email or not password or not role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing required fields")

    existing = db.execute(select(Employee).where(Employee.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employee already exists")

    employee = Employee(
        id=str(int(datetime.utcnow().timestamp() * 1000)),
        name=name,
        email=email,
        password=_hash_password(password),
        role=role,
        station=station,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return _employee_dict(employee)


@router.delete("/admin/employees/{employee_id}")
async def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    db.delete(employee)
    db.commit()
    return {"message": "Employee deleted"}
