// backend/src/routes/listings.ts
import { Router, Request, Response } from "express"
import { prisma } from "../lib/prisma"

const router = Router()

/**
 * GET /api/listings
 * Optional query params:
 *  - city: filter by city name (case-insensitive, partial match)
 */
router.get("/", async (req: Request, res: Response) => {
  const { city } = req.query as { city?: string }

  const where = city
    ? {
        city: {
          contains: city,
          mode: "insensitive",
        },
      }
    : undefined

  const items = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  res.json(items)
})

/**
 * GET /api/listings/:id
 * Returns a single listing by id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id
  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" })
  }
  res.json(listing)
})

export default router
