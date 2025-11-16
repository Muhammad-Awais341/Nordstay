// backend/src/routes/auth.ts
import { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../middleware/auth"

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || "replace_me"

type PublicUser = { id: string; email: string; role: string | null }

function signToken(user: PublicUser) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role ?? "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
}

// ---------- REGISTER ----------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email och password krävs" })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: "E-post är redan registrerad" })
    }

    const created = await prisma.user.create({
      data: {
        name,
        email,
        // 🔴 För enkelhet: spara lösenordet som text (OK för skolprojekt)
        passwordHash: password,
        role: "user" as any,
      },
    })

    const user: PublicUser = { id: created.id, email: created.email, role: (created as any).role }
    const token = signToken(user)

    // cookie + JSON
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Något gick fel vid registrering" })
  }
})

// ---------- LOGIN ----------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: "email och password krävs" })
    }

    const found = await prisma.user.findUnique({ where: { email } })
    if (!found) {
      return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" })
    }

    // 🔴 Enkel jämförelse: text mot text
    if ((found as any).passwordHash !== password) {
      return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" })
    }

    const user: PublicUser = { id: found.id, email: found.email, role: (found as any).role }
    const token = signToken(user)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ token, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Något gick fel vid inloggning" })
  }
})

// ---------- ME ----------
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const u = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true },
    })
    if (!u) return res.status(404).json({ message: "Hittade inte användaren" })
    return res.json(u)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Kunde inte hämta användare" })
  }
})

// ---------- LOGOUT ----------
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false })
  return res.json({ message: "Utloggad" })
})

export default router
