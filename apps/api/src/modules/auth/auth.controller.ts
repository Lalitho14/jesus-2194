import { loginSchema, signupSchema } from "@repo/validation";
import type { Request, Response } from "express";
import { find_user, get_tokens, login, register } from "./auth.service";
import jwt, { type JwtPayload } from "jsonwebtoken";

export async function register_controller(req: Request, res: Response) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.issues,
    });
  }

  const user = await register(result.data);

  if (!user) {
    return res.status(409).json({
      message: "Email registered already",
    });
  }

  return res.status(201).json({
    message: "User registered successfully. You can sign up now!",
  });
}

export async function login_controller(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.issues,
    });
  }

  const user = await login(result.data);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials. Check email or password",
    });
  }

  const tokens = get_tokens(user);

  res.cookie("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prduction",
    sameSite: "lax",
    path: "/",
  });

  res.cookie("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prduction",
    sameSite: "lax",
    path: "/",
  });

  /* return res.json({
    data: { user, ...tokens },
    message: "Welcome",
  }); */

  return res.json({
    data: { user },
    message: "Welcome",
  });
}

export function me_controller(req: Request, res: Response) {
  const user = (
    req as Request & {
      user: { sub: string; email: string; name: string };
    }
  ).user;

  const user_response = find_user(user.sub);

  if (!user_response) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    data: {
      user: user_response,
    },
  });
}

export function refresh_controller(req: Request, res: Response) {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res.status(401).json({
      message: "Refresh token required",
    });
  }

  try {
    const payload = jwt.verify(
      refresh_token,
      process.env.JWT_RT_SECRET!,
    ) as JwtPayload;

    const user = find_user(payload.sub ?? "");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const access_token = jwt.sign(
      { sub: user.id, name: user.name, email: user.email },
      process.env.JWT_AT_SECRET!,
      { expiresIn: "15m" },
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prduction",
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      message: "Token renovated",
    });
  } catch {
    return res.status(401).set({
      message: "Invalid refresh token or expired",
    });
  }
}
