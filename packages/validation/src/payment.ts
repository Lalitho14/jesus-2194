import { string, z } from "zod";

export const paymentSchema = z.object({
  card_number: string()
    .min(13, "Must be at least 13 digits ")
    .max(19, "Must be a maximum of 19 digits"),
  expiration_date: string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    error: "Expiration date must have MM/YY format",
  }),
  cvv: z.number(),
  full_name: z.string(),
  amount: z
    .number()
    .positive({ error: "Only amount bigger than 0." })
    .multipleOf(0.01, { error: "Only amount minimum of 0.01" }),
});

export type paymentData = z.infer<typeof paymentSchema>;
