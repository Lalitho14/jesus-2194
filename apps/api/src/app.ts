import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import paymentRoutes from "./modules/payment/payment.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

export default app;
