import { Router } from "express";
import { tempController } from "@/controllers/teacherControllers";

const router = Router();

router.get("/", tempController);

export default router;
