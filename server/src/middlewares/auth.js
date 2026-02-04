import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Missing Bearer token" });
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload: { sub: userId, role, iat, exp }
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
    };
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, error: "Unauthorized" });
    if (req.user.role !== role) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    next();
  };
}