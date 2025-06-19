import { Request, Response, NextFunction } from "express";
import { tempService } from "@/service/teacherService";

export const tempController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await tempService();
    res.status(201).json({ foo: "bar" });
  } catch (error) {
    next(error);
  }
};
