import type { paymentData } from "@repo/validation";

export function charge(userId: string, email: string, data: paymentData) {
  // Simulación de error interno
  if (process.env.SNAILPAY_ERROR) {
    return {
      id: crypto.randomUUID(),
      status: "error",
      status_detail: "SnailPay internal error",
      transaction_amount: data.amount,
      date_created: new Date(),
      authorization_code: 0,
      reference: crypto.randomUUID(),
      player_id: userId,
      player_email: email,
    };
  }

  // Validación de tarjeta
  if (data.card_number !== "1234123412341234") {
    return {
      id: crypto.randomUUID(),
      status: "rejected",
      status_detail: "Card declined",
      transaction_amount: data.amount,
      date_created: new Date(),
      authorization_code: 700,
      reference: crypto.randomUUID(),
      player_id: userId,
      player_email: email,
    };
  }

  // Validación de fecha
  if (data.expiration_date !== "12/26") {
    return {
      id: crypto.randomUUID(),
      status: "rejected",
      status_detail: "Card expired or invalid expiration date",
      transaction_amount: data.amount,
      date_created: new Date(),
      authorization_code: 600,
      reference: crypto.randomUUID(),
      player_id: userId,
      player_email: email,
    };
  }

  // Validación CVV
  if (data.cvv !== 543) {
    return {
      id: crypto.randomUUID(),
      status: "rejected",
      status_detail: "Invalid CVV",
      transaction_amount: data.amount,
      date_created: new Date(),
      authorization_code: 500,
      reference: crypto.randomUUID(),
      player_id: userId,
      player_email: email,
    };
  }

  // Validación nombre
  if (!data.full_name.trim()) {
    return {
      id: crypto.randomUUID(),
      status: "rejected",
      status_detail: "Cardholder name is required",
      transaction_amount: data.amount,
      date_created: new Date(),
      authorization_code: 400,
      reference: crypto.randomUUID(),
      player_id: userId,
      player_email: email,
    };
  }

  // Validación monto
  if (data.amount <= 0 || !Number.isFinite(data.amount)) {
    return {
      id: crypto.randomUUID(),
      status: "rejected",
      status_detail: "Invalid amount",
      transaction_amount: data.amount,
      date_created: new Date(),
      authorization_code: 300,
      reference: crypto.randomUUID(),
      player_id: userId,
      player_email: email,
    };
  }

  // Cobro exitoso
  return {
    id: crypto.randomUUID(),
    status: "approved",
    status_detail: "Transaction approved",
    transaction_amount: data.amount,
    date_created: new Date(),
    authorization_code: 200,
    reference: "",
    player_id: userId,
    player_email: email,
  };
}
