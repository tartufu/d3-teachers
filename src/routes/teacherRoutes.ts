import { Router } from "express";

import {
  registerStudentsController,
  getCommonStudentsController,
  suspendStudentController,
  retrieveNotificationsController,
} from "@/controllers/teacherControllers";

import {
  validateReqBody,
  validateReqQuery,
} from "@/middlware/validationMiddlware";

import {
  commonStudentsSchema,
  registerStudentSchema,
  retrieveNotificationsSchema,
  suspendStudentSchema,
} from "@/schemas";

const router = Router();

router.post(
  "/register",
  validateReqBody(registerStudentSchema),
  registerStudentsController
);

router.get(
  "/commonstudents",
  validateReqQuery(commonStudentsSchema),
  getCommonStudentsController
);

router.post(
  "/suspend",
  validateReqBody(suspendStudentSchema),
  suspendStudentController
);

router.post(
  "/retrievefornotifications",
  validateReqBody(retrieveNotificationsSchema),
  retrieveNotificationsController
);

export default router;
