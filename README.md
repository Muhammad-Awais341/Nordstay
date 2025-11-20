# 🌐 Nordstay – Fullstack Bokningsplattform

Nordstay är en Airbnb-inspirerad bokningsapplikation. Projektet består av en fullstack-lösning med  
React + TypeScript i frontend och Node.js + Express + Prisma + Supabase i backend.

---

## ✨ Funktioner

- Responsiv startsida med hero-sektion
- Sökfält för destinationer
- Visning av boenden i kortformat med bilder, pris och stad
- Detaljsida för boende med bilder, info och bokningsformulär
- Registrering & inloggning (JWT)
- Boka boende
- Se alla bokningar under “Mina bokningar”
- Simulerad betalningsvy

---

## 🛠 Teknikstack

### **Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- React Router

### **Backend**
- Node.js + Express
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- JSON Web Tokens
- CORS & Cookie Parser

---

## 🗄 Databasmodell

### **User**
- id  
- name  
- email  
- passwordHash  

### **Listing**
- id  
- title  
- description  
- city  
- address  
- images (String[])  
- pricePerNight  
- maxGuests  
- hostId  

### **Booking**
- id  
- userId  
- listingId  
- startDate  
- endDate  
- totalPrice  

---
🚀 Starta frontend
cd frontend
npm install
npm run dev


Frontend körs på:
👉 http://localhost:5173/

🚀 Starta backend
cd backend
npm install
npx prisma db push
npx ts-node src/seed.ts
npm run dev


Backend körs på:
👉 http://localhost:4001/

📦 Seed-data

Seed-scriptet skapar:

Demo-användare:

Email: demo@user.com

Lösenord: test1234

Host-användare:

Email: host@example.com

Lösenord: test1234

+ 8 boenden i Sverige, Danmark, Frankrike och England.