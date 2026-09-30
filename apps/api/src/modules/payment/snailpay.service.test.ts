import assert from "node:assert/strict";
import { test } from "node:test";
import type { paymentData } from "@repo/validation";
import { charge } from "./snailpay.service";

const user_id = "user-123";
const email = "player@example.com";

const valid_payment = (overrides: Partial<paymentData> = {}): paymentData => ({
  card_number: "1234123412341234",
  expiration_date: "12/26",
  cvv: 543,
  full_name: "Test Player",
  amount: 25.5,
  ...overrides,
});

function charge_with_error_setting(data: paymentData, simulate_error = false) {
  const previous_error = process.env.SNAILPAY_ERROR;

  try {
    if (simulate_error) process.env.SNAILPAY_ERROR = "true";
    else delete process.env.SNAILPAY_ERROR;

    return charge(user_id, email, data);
  } finally {
    if (previous_error === undefined) delete process.env.SNAILPAY_ERROR;
    else process.env.SNAILPAY_ERROR = previous_error;
  }
}

function assert_transaction_metadata(result: ReturnType<typeof charge>, amount: number) {
  assert.match(result.id, /^[0-9a-f-]{36}$/i);
  assert.ok(result.date_created instanceof Date);
  assert.equal(result.transaction_amount, amount);
  assert.equal(result.player_id, user_id);
  assert.equal(result.player_email, email);
}

test("charge approves a valid payment", () => {
  const data = valid_payment();
  const result = charge_with_error_setting(data);

  assert.equal(result.status, "approved");
  assert.equal(result.status_detail, "Transaction approved");
  assert.equal(result.authorization_code, 200);
  assert.equal(result.reference, "");
  assert_transaction_metadata(result, data.amount);
});

test("charge rejects payments with invalid card details or amount", async (t) => {
  const rejected_cases: {
    name: string;
    data: paymentData;
    status_detail: string;
    authorization_code: number;
  }[] = [
    {
      name: "card number",
      data: valid_payment({ card_number: "1111222233334444" }),
      status_detail: "Card declined",
      authorization_code: 700,
    },
    {
      name: "expiration date",
      data: valid_payment({ expiration_date: "11/25" }),
      status_detail: "Card expired or invalid expiration date",
      authorization_code: 600,
    },
    {
      name: "CVV",
      data: valid_payment({ cvv: 123 }),
      status_detail: "Invalid CVV",
      authorization_code: 500,
    },
    {
      name: "cardholder name",
      data: valid_payment({ full_name: "   " }),
      status_detail: "Cardholder name is required",
      authorization_code: 400,
    },
    {
      name: "zero amount",
      data: valid_payment({ amount: 0 }),
      status_detail: "Invalid amount",
      authorization_code: 300,
    },
    {
      name: "non-finite amount",
      data: valid_payment({ amount: Number.POSITIVE_INFINITY }),
      status_detail: "Invalid amount",
      authorization_code: 300,
    },
  ];

  for (const rejected_case of rejected_cases) {
    await t.test(rejected_case.name, () => {
      const result = charge_with_error_setting(rejected_case.data);

      assert.equal(result.status, "rejected");
      assert.equal(result.status_detail, rejected_case.status_detail);
      assert.equal(result.authorization_code, rejected_case.authorization_code);
      assert.match(result.reference, /^[0-9a-f-]{36}$/i);
      assert_transaction_metadata(result, rejected_case.data.amount);
    });
  }
});

test("charge reports simulated provider errors before validating payment data", () => {
  const data = valid_payment({ card_number: "invalid" });
  const result = charge_with_error_setting(data, true);

  assert.equal(result.status, "error");
  assert.equal(result.status_detail, "SnailPay internal error");
  assert.equal(result.authorization_code, 0);
  assert.match(result.reference, /^[0-9a-f-]{36}$/i);
  assert_transaction_metadata(result, data.amount);
});