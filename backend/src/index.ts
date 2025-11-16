import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { prisma } from "./lib/prisma"

import authRouter from "./routes/auth"        // ✅ Add this line
import bookingRouter from "./routes/bookings" // ✅ (if you have it)
import listingRouter from "./routes/listings" // ✅ (if you have it)

const app = express()

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,               // allow cookies
  })
)
app.use(cookieParser())
app.use(express.json())

// --- Routes ---
app.use("/api/auth", authRouter)       // ✅ Add this line
app.use("/api/bookings", bookingRouter)
app.use("/api/listings", listingRouter)

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

// --- Start server ---
const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
