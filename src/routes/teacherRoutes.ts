import { Router } from "express";

import {
  registerStudentsController,
  getCommonStudentsController,
  suspendStudentController,
  retrieveNotificationsController,
} from "@/controllers/teacherControllers";

import { validateData } from "@/middlware/validationMiddlware";

import {
  registerStudentSchema,
  retrieveNotificationsSchema,
  suspendStudentSchema,
} from "@/schemas";

const router = Router();

router.post(
  "/register",
  validateData(registerStudentSchema),
  registerStudentsController
);

router.get("/commonstudents", getCommonStudentsController);

router.post(
  "/suspend",
  validateData(suspendStudentSchema),
  suspendStudentController
);

router.post(
  "/retrievefornotifications",
  validateData(retrieveNotificationsSchema),
  retrieveNotificationsController
);

export default router;
