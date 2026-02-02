import time

from fastapi import FastAPI

from app.presentation.routes import router, SessionLocal, engine
from app.infrastructure.db import Base
from app.infrastructure import repositories
from app.application import services
from shared.config import get_env

app = FastAPI(title="CargoTrans Auth Service")
app.include_router(router)


@app.on_event("startup")
def seed_admin():
    for _ in range(20):
        try:
            Base.metadata.create_all(bind=engine)
            break
        except Exception:
            time.sleep(1)
    username = get_env("ADMIN_USER", "admin")
    password = get_env("ADMIN_PASSWORD", "admin123")
    db = SessionLocal()
    try:
        existing = repositories.get_user_by_username(db, username)
        if not existing:
            services.register_user(db, username, password, "System Admin", ["ADMIN"])
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
