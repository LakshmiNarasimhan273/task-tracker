import express from "express";
import taskController from "../controller/task.controller.js";
import isRole from "../middleware/roleMiddleware.js";

const router = express();

router.post("/create-tasks", isRole(['manager', 'team-leads']), taskController.createTask)

export default router;