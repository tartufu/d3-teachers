import express from "express";
import teacherRoutes from "./routes/teacherRoutes";

const app = express();

app.use(express.json());

// // Routes
app.use("/api/teachers", teacherRoutes);

// // Global error handler (should be after routes)
// app.use(errorHandler);

export default app;
