import express from "express";
import teacherRoutes from "@/routes/teacherRoutes";

const app = express();

app.use(express.json());

// // Routes

app.get("/", (req, res) => {
  res.json({ message: "health check" });
});

app.use("/api", teacherRoutes);

// // Global error handler (should be after routes)
// app.use(errorHandler);

export default app;
