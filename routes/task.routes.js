import express from "express";
import taskController from "../controller/task.controller.js";
import isRole from "../middleware/roleMiddleware.js";

const router = express();

// router method to create a new task, once the login credentials matches the role of manager or team-lead
router.post("/create-tasks", isRole(['manager', 'team-leads']), taskController.createTask)

export default router;