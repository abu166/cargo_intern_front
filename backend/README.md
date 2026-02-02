# CargoTrans Backend (Microservices + Hex)

## Quick start
1. `docker compose -f backend/docker-compose.yml up --build`
2. Auth service: `http://localhost:8001`
3. Shipments: `http://localhost:8002`
4. Finance: `http://localhost:8003`
5. WMS: `http://localhost:8004`

Default admin:
- username: `admin`
- password: `admin123`

## Auth flow
1. `POST /auth/login` on auth service with `{ "username": "admin", "password": "admin123" }`
2. Use returned `access_token` as `Authorization: Bearer <token>` for all other services.

## Service map
- Auth: users, clients, audit
- Shipments: shipments, status transitions, QR, documents, scan events
- Finance: tariffs, payments, FO-3 report
- WMS: warehouses, cells, sessions, sensor events, route planning, transport, delivery

## Notes
- Each service uses its own Postgres database.
- Status transitions are enforced in the Shipments service.
- WMS and Finance call Shipments to update shipment status when needed.

## Postman
- Collection: `backend/postman/CargoTrans.postman_collection.json`

## Tests
- Install: `pip install -r backend/requirements.txt -r backend/requirements-dev.txt`
- Run: `pytest -q backend/tests`
