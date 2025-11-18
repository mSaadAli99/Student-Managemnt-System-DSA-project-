import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { teacherMiddleware } from "../middleware/teacherMiddleware.js";
import {
  addLesson,
  createClass,
  getClassStudents,
  getLessons,
  getStudentClasses,
  getTeacherClasses,
  sendInvite,
} from "../controllers/class.controller.js";

const router = express.Router();

router.post("/create-class", authMiddleware, teacherMiddleware, createClass);
router.post("/send-invite", authMiddleware, teacherMiddleware, sendInvite);
router.post("/add-lesson", authMiddleware, teacherMiddleware, addLesson);
router.get("/classes", authMiddleware, getTeacherClasses);
router.get("/student/classes", authMiddleware, getStudentClasses);
router.post('/classes/:classId/students', authMiddleware, getClassStudents);
router.get("/:classId/get-lessons", authMiddleware, getLessons);

export default router;
