import assert from "node:assert/strict";
import { mock, test } from "node:test";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { User } from "@repo/types";
import type { signupData } from "@repo/validation";
import { find_user, get_tokens, login, register } from "./auth.service";

const signup_input = (email: string): signupData => ({
  name: "Test User",
  email,
  password: "correct-password",
  confirm_password: "correct-password",
});

test("register creates a user without exposing the password", async (t) => {
  t.mock.method(console, "log", () => undefined);
  const input = signup_input(`register-${crypto.randomUUID()}@example.com`);

  const user = await register(input);

  assert.ok(user);
  assert.equal(user.name, input.name);
  assert.equal(user.email, input.email);
  assert.equal(user.balance, 0);
  assert.equal("password" in user, false);
  const authenticated_user = await login({ email: input.email, password: input.password });
  assert.ok(authenticated_user);
  assert.equal(authenticated_user.id, user.id);
});

test("register rejects an already registered email", async (t) => {
  t.mock.method(console, "log", () => undefined);
  const input = signup_input(`duplicate-${crypto.randomUUID()}@example.com`);

  assert.ok(await register(input));
  assert.equal(await register(input), null);
});

test("login rejects unknown emails and incorrect passwords", async (t) => {
  t.mock.method(console, "log", () => undefined);
  const input = signup_input(`login-${crypto.randomUUID()}@example.com`);
  await register(input);

  assert.equal(
    await login({ email: `missing-${input.email}`, password: input.password }),
    null,
  );
  assert.equal(await login({ email: input.email, password: "incorrect-password" }), null);
});

test("find_user returns a user without the stored password", async (t) => {
  t.mock.method(console, "log", () => undefined);
  const input = signup_input(`find-${crypto.randomUUID()}@example.com`);
  const created = await register(input);
  assert.ok(created);

  assert.deepEqual(find_user(created.id), created);
  assert.equal(find_user(crypto.randomUUID()), null);
});

test("get_tokens signs access and refresh tokens with the expected claims", (t) => {
  const previous_access_secret = process.env.JWT_AT_SECRET;
  const previous_refresh_secret = process.env.JWT_RT_SECRET;
  t.after(() => {
    if (previous_access_secret === undefined) delete process.env.JWT_AT_SECRET;
    else process.env.JWT_AT_SECRET = previous_access_secret;
    if (previous_refresh_secret === undefined) delete process.env.JWT_RT_SECRET;
    else process.env.JWT_RT_SECRET = previous_refresh_secret;
  });
  process.env.JWT_AT_SECRET = "test-access-secret";
  process.env.JWT_RT_SECRET = "test-refresh-secret";
  const user: User = {
    id: crypto.randomUUID(),
    name: "Test User",
    email: "tokens@example.com",
    balance: 0,
  };

  const tokens = get_tokens(user);
  const access_payload = jwt.verify(tokens.access_token, process.env.JWT_AT_SECRET) as JwtPayload;
  const refresh_payload = jwt.verify(tokens.refresh_token, process.env.JWT_RT_SECRET) as JwtPayload;

  assert.deepEqual(
    { sub: access_payload.sub, name: access_payload.name, email: access_payload.email },
    { sub: user.id, name: user.name, email: user.email },
  );
  assert.equal((access_payload.exp ?? 0) - (access_payload.iat ?? 0), 15 * 60);
  assert.deepEqual({ sub: refresh_payload.sub }, { sub: user.id });
  assert.equal((refresh_payload.exp ?? 0) - (refresh_payload.iat ?? 0), 7 * 24 * 60 * 60);
});