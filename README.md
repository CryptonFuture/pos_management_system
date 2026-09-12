# POS Management System

Complete **Point of Sale (POS)** system built with modern stack.

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| **Backend**        | Node.js + Express.js + MongoDB      |
| **Python Service** | FastAPI (Analytics & Reports)       |
| **Frontend**       | React 18 + Vite + Tailwind CSS      |
| **Auth**           | JWT + bcrypt                        |

## Features

- **POS Terminal** – Fast product search, cart, tax/discount, multi-payment (Cash/Card/Mobile)
- **Real-time stock deduction** on sale
- **Invoice generation** with change calculation
- **Sales History** + Refund (restores stock)
- **Product & Category management**
- **Customer management**
- **Dashboard** – Today’s sales, revenue, charts
- **Python Analytics** – Daily summary, inventory health, predictions
- Role-based access (Admin / Manager / Cashier)

## Project Structure

```
pos-system/
├── backend/           # Node.js + Express + MongoDB
├── python-service/    # FastAPI microservice
├── frontend/          # React + Vite
└── README.md
```

## Setup

### 1. MongoDB
Make sure MongoDB is running on `mongodb://127.0.0.1:27017`

### 2. Backend
```bash
cd backend
npm install
npm run seed
npm run dev          # http://localhost:5001
```

**Login Credentials:**
| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Admin   | admin@pos.com      | admin123    |
| Cashier | cashier@pos.com    | cashier123  |
| Manager | manager@pos.com    | manager123  |

### 3. Python Service
```bash
cd python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:3001
```

Open → http://localhost:3001

## Ports

| Service   | Port |
|-----------|------|
| Backend   | 5001 |
| Frontend  | 3001 |
| Python    | 8001 |

## Main API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/auth/login       | Login                |
| GET    | /api/products         | List products        |
| POST   | /api/sales            | Create sale (checkout)|
| GET    | /api/sales            | Sales history        |
| POST   | /api/sales/:id/refund | Refund sale          |
| GET    | /api/dashboard/stats  | Dashboard stats      |

---

Built with Node.js, Express, MongoDB, Python FastAPI & React Vite
# pos_management_system
