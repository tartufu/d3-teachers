import express from "express";
import teacherRoutes from "@/routes/teacherRoutes";
import { errorHandler } from "./middlware/errorHandler";
import { generateErrorObj } from "./utils";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "health check" });
});

app.use("/api", teacherRoutes);

// 404 middleware - must come AFTER all routes
app.use((req, res, next) => {
  next(generateErrorObj("Route does not exist", 404));
});

app.use(errorHandler);

export default app;
