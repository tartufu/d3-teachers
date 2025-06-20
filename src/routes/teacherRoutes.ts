import { Router } from "express";
import {
  registerStudentsController,
  getCommonStudentsController,
} from "@/controllers/teacherControllers";

const router = Router();

router.post("/register", registerStudentsController);

router.get("/commonstudents", getCommonStudentsController);

export default router;
