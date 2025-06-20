import { Router } from "express";
import { registerStudentsController } from "@/controllers/teacherControllers";

const router = Router();

router.post("/register", registerStudentsController);

export default router;
