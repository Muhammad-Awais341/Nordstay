// backend/src/routes/bookings.ts
import { Router } from "express"
import { prisma } from "../lib/prisma"

const router = Router()

// Hjälpfunktion: hämta demo-användaren (demo@user.com)
async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: "demo@user.com" },
  })
  if (!user) {
    throw new Error("Demo user saknas i databasen (demo@user.com). Kör seed igen.")
  }
  return user.id
}

// Helper: räkna nätter (minst 1 natt)
function calcNights(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime()
  const nights = Math.round(ms / (1000 * 60 * 60 * 24))
  return nights <= 0 ? 1 : nights
}

// GET /api/bookings – bokningar för demo-användaren
router.get("/", async (_req, res) => {
  try {
    const userId = await getDemoUserId()

    const items = await prisma.booking.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { startDate: "desc" },
    })

    res.json(items)
  } catch (err: any) {
    console.error("GET /api/bookings error:", err)
    res.status(500).json({ message: "Kunde inte hämta bokningar" })
  }
})

// POST /api/bookings – skapa bokning åt demo-användaren
router.post("/", async (req, res) => {
  try {
    const userId = await getDemoUserId()
    const { listingId, startDate, endDate } = req.body || {}

    if (!listingId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "listingId, startDate och endDate krävs" })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })
    if (!listing) {
      return res.status(404).json({ message: "Hittar inte valt boende" })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const nights = calcNights(start, end)
    const totalPrice = nights * listing.pricePerNight

    const booking = await prisma.booking.create({
      data: {
        listingId,
        userId,
        startDate: start,
        endDate: end,
        totalPrice, // ✅ nu skickar vi med totalPrice
      },
      include: { listing: true },
    })

    res.json({ message: "Bokning skapad", booking })
  } catch (err: any) {
    console.error("POST /api/bookings error:", err)
    res.status(500).json({ message: "Kunde inte skapa bokning" })
  }
})

export default router
