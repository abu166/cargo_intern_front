import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.presentation.routes import router, SessionLocal, engine
from app.infrastructure.db import Base
from app.infrastructure import repositories
from app.application import services
from shared.config import get_env

app = FastAPI(title="CargoTrans Auth Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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
        demo_users = [
            ("operator@mail.kz", "demo", "Оператор", ["OPERATOR"]),
            ("corporate@mail.kz", "demo", "Корпоративный клиент", ["CORPORATE"]),
            ("user@mail.kz", "demo", "Физическое лицо", ["INDIVIDUAL"]),
            ("receiver@mail.kz", "demo", "Приемосдатчик", ["RECEIVER", "OPERATOR"]),
            ("wms@mail.kz", "demo", "WMS", ["WMS"]),
            ("cashier@mail.kz", "demo", "Кассир", ["CASHIER"]),
            ("accountant@mail.kz", "demo", "Бухгалтер", ["ACCOUNTANT"]),
        ]
        for demo_username, demo_password, full_name, roles in demo_users:
            if not repositories.get_user_by_username(db, demo_username):
                services.register_user(db, demo_username, demo_password, full_name, roles)
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
