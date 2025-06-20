import { Router } from "express";
import { tempController } from "@/controllers/teacherControllers";

const router = Router();

router.get("/", tempController);

router.post("", tempController);

export default router;
