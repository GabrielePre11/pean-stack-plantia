import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoute from "./routes/auth.route";
import wishlistRoute from "./routes/wishlist.route";
import cartRoute from "./routes/cart.route";
import categoryRoute from "./routes/category.route";
import reviewRoute from "./routes/review.route";
import plantRoute from "./routes/plant.route";

import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const API_URL = "/api/v1";

//============ Middlewares ============//
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(errorMiddleware);

//============ Routes ============//
app.use(`${API_URL}/auth`, authRoute);
app.use(`${API_URL}/wishlist`, wishlistRoute);
app.use(`${API_URL}/cart`, cartRoute);
app.use(`${API_URL}/categories`, categoryRoute);
app.use(`${API_URL}/reviews`, reviewRoute);
app.use(`${API_URL}/plants`, plantRoute);

//============ Production ============//
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(
    process.cwd(),
    "frontend",
    "dist",
    "frontend",
    "browser"
  );

  app.use(express.static(frontendPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

//============ Server Start ============//
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
