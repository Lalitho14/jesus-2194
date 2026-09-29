import type { Response, Request } from "express";
import { charge } from "./snailpay.service";
import { update_balance } from "../auth/auth.repository";
import { find_user } from "../auth/auth.service";
import { paymentSchema } from "@repo/validation";

export function charge_controller(req: Request, res: Response) {
  const validation_data = paymentSchema.safeParse(req.body);

  if (!validation_data.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: validation_data.error.issues,
    });
  }
  const user = find_user(req.user?.sub ?? "");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const result = charge(user.id, user.email, req.body);

  if (result.status === "approved") {
    update_balance(user.id, result.transaction_amount);

    return res.status(201).json({
      data: {
        result,
        card: {
          card_number: validation_data.data.card_number,
          cvv: validation_data.data.cvv,
        },
      },
      message: result.status_detail,
    });
  } else {
    return res.status(500).json({
      data: {
        result,
        card: {
          card_number: validation_data.data.card_number,
          cvv: validation_data.data.cvv,
        },
      },
      message: result.status_detail,
    });
  }
}
