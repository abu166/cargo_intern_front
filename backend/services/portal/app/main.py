from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from sqlalchemy import select

from app.db import Base, engine, SessionLocal
from app.models import Employee
from app.routes import router
from app.socket import sio
from app.routes import _hash_password


fastapi_app = FastAPI(title="CargoTrans Portal Service")

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@fastapi_app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    # Seed default admin operator if not present
    db = SessionLocal()
    try:
        existing = db.execute(select(Employee).where(Employee.email == "admin@cargo.kz")).scalar_one_or_none()
        if not existing:
            employee = Employee(
                id="admin",
                name="Admin",
                email="admin@cargo.kz",
                password=_hash_password("admin"),
                role="admin",
                station=None,
            )
            db.add(employee)
            db.commit()
    finally:
        db.close()


fastapi_app.include_router(router)

app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)
