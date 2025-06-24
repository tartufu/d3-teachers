import { Request, Response, NextFunction } from "express";
import {
  registerStudentsService,
  getCommonStudentsService,
  suspendStudentService,
  retrieveNotificationsService,
} from "@/service/teacherService";

export const registerStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await registerStudentsService(req.body);

    res.status(204).send();
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
    console.log(req.query);

    let data = [];

    if (Array.isArray(req.query.teacher)) {
      data = req.query.teacher;
    } else {
      data = [req.query.teacher];
    }

    const commonStudentsData = await getCommonStudentsService(data);
    res.status(200).json(commonStudentsData);
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
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const retrieveNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await retrieveNotificationsService(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
