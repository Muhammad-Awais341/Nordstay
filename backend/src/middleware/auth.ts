import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "replace_me"
export type AuthUser = { id: string; email: string; role?: string }

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Bearer header
    const auth = req.headers.authorization
    let token: string | undefined = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined
    // Fallback: httpOnly cookie
    if (!token && req.cookies?.token) token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    const payload = jwt.verify(token, JWT_SECRET) as AuthUser
    if (!payload?.id) return res.status(401).json({ message: "Unauthorized" })

    req.user = { id: payload.id, email: payload.email, role: payload.role }
    next()
  } catch {
    return res.status(401).json({ message: "Unauthorized" })
  }
}
