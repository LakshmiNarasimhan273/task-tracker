import express from "express";
import taskController from "../controller/task.controller.js";
import isRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create-tasks", isRole(["manager", "team-lead"]), taskController.createTask);
router.post("/:taskId/start", isRole(["developer", "tester"]), taskController.startTask);
router.post("/:taskId/end", isRole(["developer", "tester"]), taskController.endTask);

router.get("/my-tasks", isRole(["developer", "tester"]), taskController.getUserTasks);
router.patch("/update-task-status/:taskId", isRole(["manager", "team-lead", "developer", "tester"]), taskController.updateTaskStatus);

router.delete("/:taskId", isRole(["manager", "team-lead"]), taskController.deleteTask);

export default router;
