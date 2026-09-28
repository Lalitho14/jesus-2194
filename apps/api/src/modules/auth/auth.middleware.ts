import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

export function auth_middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      message: "No authorized",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_AT_SECRET!) as JwtPayload;

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token or expired",
    });
  }
}
