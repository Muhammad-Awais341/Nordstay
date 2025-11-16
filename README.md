# Airbnb Mini (Fullstack Starter)

A minimal Airbnb-like app following your Figma prototype, built with **React + TypeScript + Tailwind** (frontend) and **Node + Express + TypeScript + Prisma (PostgreSQL)** (backend).

## Quick Start

### 1) Database (PostgreSQL)
Use Docker:
```bash
docker run --name airbnb-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=airbnb -p 5432:5432 -d postgres:16
```

### 2) Backend
```bash
cd backend
cp .env.example .env   # set DATABASE_URL and JWT_SECRET if needed
npm i
npx prisma migrate dev --name init
npm run dev
```
API at `http://localhost:4000/api`

### 3) Frontend
```bash
cd ../frontend
npm i
npm run dev
```
App at `http://localhost:5173`

## Notes
- Login/Register available under `/login` & `/register`
- Listings at `/` (Home). Clicking a card opens details and allows booking (requires login).
- My bookings at `/bookings`.
- Tailwind theme colors currently set to defaults. Replace with your Figma values in `tailwind.config.js`.
