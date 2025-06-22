import { Router } from "express";
import {
  registerStudentsController,
  getCommonStudentsController,
  suspendStudentController,
  retrieveNotificationsController,
} from "@/controllers/teacherControllers";

const router = Router();

router.post("/register", registerStudentsController);

router.get("/commonstudents", getCommonStudentsController);

router.post("/suspend", suspendStudentController);

router.post("/retrievefornotifications", retrieveNotificationsController);

export default router;
