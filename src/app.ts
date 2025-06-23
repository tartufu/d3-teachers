import express from "express";
import teacherRoutes from "@/routes/teacherRoutes";
import { errorHandler } from "./middlware/errorHandler";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "health check" });
});

app.use("/api", teacherRoutes);

// 404 middleware - must come AFTER all routes
app.use((req, res, next) => {
  const error = new Error("Not Found");
  (error as any).status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
