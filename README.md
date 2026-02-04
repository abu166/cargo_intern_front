# CargoTrans – Full Stack (Frontend + Backend)

CargoTrans is a rail baggage & cargo logistics system that manages the entire shipment lifecycle: acceptance, tariff calculation, payment, QR tracking, WMS storage, transport, arrival, and delivery. This repository contains both the frontend UI and the backend microservices.

## Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Docker / Docker Compose

### Testing & CI
- Pytest
- GitHub Actions (backend CI workflow)

---

## Repository Structure

```
./project/        # Frontend (React + Vite)
./backend/        # Backend services + docker compose
./.github/        # CI workflows
```

### Backend services (hex architecture)
Each backend service has: `domain/`, `application/`, `infrastructure/`, `presentation/`.

- **Auth Service (8001)** – users, clients, roles, audit log
- **Shipments Service (8002)** – shipments, status transitions, QR, documents, scan events
- **Finance Service (8003)** – tariffs, payments, FO‑3 report
- **WMS Service (8004)** – warehouses, storage cells, WMS sessions, transport/delivery

---

## How to Run

### Backend (Docker)
```
docker compose -f backend/docker-compose.yml up --build
```

### Frontend
```
cd project
npm install
npm run dev
```

---

## Demo Credentials

Admin:
- username: `admin`
- password: `admin123`

Demo users (password: `demo`):
- `operator@mail.kz`
- `corporate@mail.kz`
- `user@mail.kz`
- `receiver@mail.kz`
- `wms@mail.kz`
- `cashier@mail.kz`
- `accountant@mail.kz`

---

## Service URLs

### API Docs (Swagger)
- Auth: `http://localhost:8001/docs`
- Shipments: `http://localhost:8002/docs`
- Finance: `http://localhost:8003/docs`
- WMS: `http://localhost:8004/docs`

### Health
- `http://localhost:8001/health`
- `http://localhost:8002/health`
- `http://localhost:8003/health`
- `http://localhost:8004/health`

---

## Frontend ⇄ Backend Integration

Implemented endpoint integration:
- Auth login/logout/me
- Create clients and shipments
- Shipment status transitions
- QR + documents generation
- WMS cell operations
- Transport, arrival, delivery
- Finance payments + FO‑3 report
- Audit logs and admin user management

---

## Notes
- The frontend uses `.env` for API URLs.
- WMS service automatically seeds a default warehouse and cells.
- Status transitions are enforced in Shipments service.

---

## Postman Collection
The full Postman collection is located at:
```
backend/postman/CargoTrans.postman_collection.json
```