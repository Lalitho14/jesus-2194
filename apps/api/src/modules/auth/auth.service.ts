import type { loginData, signupData } from "@repo/validation";
import * as bcrypt from "bcrypt";
import {
  create_user,
  find_user_by_email,
  find_user_by_id,
} from "./auth.repository";
import type { User } from "@repo/types";
import jwt from "jsonwebtoken";

function hash_data(data: string) {
  return bcrypt.hash(data, 10);
}

export function get_tokens(user: User) {
  const [at, rt] = [
    jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_AT_SECRET!,
      {
        expiresIn: "15m",
      },
    ),
    jwt.sign(
      {
        sub: user.id,
      },
      process.env.JWT_RT_SECRET!,
      {
        expiresIn: "7d",
      },
    ),
  ];

  return {
    access_token: at,
    refresh_token: rt,
  };
}

export async function register(input: signupData): Promise<User | null> {
  const is_registered = find_user_by_email(input.email);

  if (is_registered) return null;

  const user = create_user({
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    password: await hash_data(input.password),
    balance: 0,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance,
  };
}

export async function login(input: loginData): Promise<User | null> {
  const user = find_user_by_email(input.email);

  if (!user) return null;

  const compare_passwords = await bcrypt.compare(input.password, user.password);

  if (!compare_passwords) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance,
  };
}

export function find_user(id: string) {
  const user = find_user_by_id(id);

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance,
  };
}
