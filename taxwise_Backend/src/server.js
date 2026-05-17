
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import profileRoutes from "./routes/profileRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";

connectDB();

const app=express();
app.use(
  cors(
    {
      origin: "http://localhost:5173",
      credentials: true,
    }
  ));
  
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaxWise Vault Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/tax", taxRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});