import { Request, Response, NextFunction } from "express";
import {
  registerStudentsService,
  getCommonStudentsService,
  suspendStudentService,
} from "@/service/teacherService";

export const registerStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // zod handling
    // console.log("req", req.body);

    await registerStudentsService(req.body);
    res.status(204).json({ foo: "bar" });
  } catch (error) {
    next(error);
  }
};

export const getCommonStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // zod handling
    // console.log("req", req.body);

    let data = [];

    if (Array.isArray(req.query.teacher)) {
      data = req.query.teacher;
    } else {
      data = [req.query.teacher];
    }

    await getCommonStudentsService(data);
    res.status(201).json({ foo: "bar" });
  } catch (error) {
    next(error);
  }
};

export const suspendStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await suspendStudentService(req.body);
    res.status(204).json({ foo: "one" });
  } catch (error) {
    next(error);
  }
};
