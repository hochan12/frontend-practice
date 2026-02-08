import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Missing Bearer token" });
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
    };
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

/**
 * ✅ 선택 로그인: 토큰 있으면 req.user 세팅, 없으면 그냥 통과
 */
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
    };
  } catch {
    // 토큰이 이상해도 막지 않음(그냥 비로그인 취급)
  }
  return next();
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