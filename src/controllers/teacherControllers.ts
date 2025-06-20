import { Request, Response, NextFunction } from "express";
import { registerStudentsService } from "@/service/teacherService";

export const registerStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // zod handling
    // console.log("req", req.body);

    await registerStudentsService(req.body);
    res.status(201).json({ foo: "bar" });
  } catch (error) {
    next(error);
  }
};
