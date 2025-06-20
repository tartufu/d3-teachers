import { Router } from "express";
import {
  registerStudentsController,
  getCommonStudentsController,
  suspendStudentController,
} from "@/controllers/teacherControllers";

const router = Router();

router.post("/register", registerStudentsController);

router.get("/commonstudents", getCommonStudentsController);

router.post("/suspend", suspendStudentController);

export default router;
