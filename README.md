NordStay

NordStay is a simple Airbnb-style app where users can view listings, see details, log in, and make bookings.

🚀 Tech Stack

Frontend: React + Vite + TypeScript, Tailwind CSS, React Router, React Query

Backend: Node.js + Express + TypeScript (API on http://localhost:4001)

Database & Auth: Supabase (PostgreSQL + Email/Password Auth)

🔧 Setup Instructions
1. Start Backend
cd backend
npm install
npm run dev

2. Supabase Environment

In frontend/.env:

VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key

3. Start Frontend
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

📌 Features

User Login / Signup (Supabase Auth)

View Listings

Listing Details Page

Booking System

User Bookings Page

📁 Folder Structure
NordStay/
 ├── backend/    # Express API
 ├── frontend/   # React App
 └── README.md
