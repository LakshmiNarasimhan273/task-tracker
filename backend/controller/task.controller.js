import User from "../model/user.model.js";
import Task from "../model/task.model.js";

// Create Task
const createTask = async (req, res) => {
    try {
        const { taskTitle, taskPriority, taskDescription, taskStatus, assignedPerson, dueDate } = req.body;

        // Validate logged-in user's role
        const user = await User.findById(req.user.userId);
        if (!user || !["manager", "team-lead"].includes(user.role)) {
            return res.status(403).json({ message: "Access denied! Only Managers and Team Leads can create tasks." });
        }

        // Validate assigned person's role
        const assignedUser = await User.findById(assignedPerson);
        if (!assignedUser || !["developer", "tester"].includes(assignedUser.role)) {
            return res.status(400).json({ message: "Assigned person must be a Developer or Tester" });
        }

        // Create and save task
        const newTask = new Task({
            taskTitle,
            taskPriority,
            taskDescription,
            taskStatus,
            assignedPerson,
            dueDate,
            assignedDate: new Date(),
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (err) {
        console.error("Error in createTask:", err.message);
        res.status(500).json({ message: `Task creation failed: ${err.message}` });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params; // Get task ID from URL
        const { taskStatus } = req.body; // Get new status from request body
        const { userId, role } = req.user; // Extract user ID and role from token

        // Validate the task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Role-based status update rules
        if (["developer", "tester"].includes(role)) {
            // Developers/Testers can only update specific statuses
            if (
                (task.taskStatus === "assigned" && taskStatus === "in-progress") ||
                (task.taskStatus === "in-progress" && taskStatus === "qc-assigned")
            ) {
                task.taskStatus = taskStatus; // Update status
                await task.save();
                return res.status(200).json({ message: "Task status updated successfully", task });
            } else {
                return res.status(403).json({
                    message:
                        "Access denied! You can only update status from 'assigned' to 'in-progress' or 'in-progress' to 'qc-assigned'.",
                });
            }
        } else if (["manager", "team-lead"].includes(role)) {
            // Managers/Team Leads can update to any status
            const validStatuses = ["assigned", "in-progress", "qc-assigned", "qc-completed"];
            if (!validStatuses.includes(taskStatus)) {
                return res.status(400).json({ message: "Invalid status provided" });
            }

            task.taskStatus = taskStatus; // Update status
            await task.save();
            return res.status(200).json({ message: "Task status updated successfully", task });
        } else {
            return res.status(403).json({
                message: "Access denied! You do not have permission to update the task status.",
            });
        }
    } catch (error) {
        console.error("Error in updateTaskStatus:", error.message);
        res.status(500).json({ message: `Failed to update task status: ${error.message}` });
    }
};


const startTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.startTime) {
            return res.status(400).json({ message: "Task has already been started" });
        }

        task.startTime = new Date();
        await task.save();

        res.status(200).json({ message: "Task started", task });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Failed to start task" });
    }
};

const endTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (!task.startTime) {
            return res.status(400).json({ message: "Task has not been started yet" });
        }

        if (task.endTime) {
            return res.status(400).json({ message: "Task has already been ended" });
        }

        task.endTime = new Date();
        task.calculateTimeSpent();
        await task.save();

        res.status(200).json({ message: "Task ended", task });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Failed to end task" });
    }
};

const getUserTasks = async (req, res) => {
    try {
        // Fetch the user from token
        const { userId, role } = req.user;

        // Allow only developers and testers to access this API
        if (!["developer", "tester"].includes(role)) {
            return res.status(403).json({
                message: "Access denied! Only Developers and Testers can view assigned tasks.",
            });
        }

        // Find all tasks assigned to this user
        const tasks = await Task.find({ assignedPerson: userId }).populate("assignedPerson", "username email role");

        if (!tasks.length) {
            return res.status(404).json({
                message: "No tasks assigned to you yet.",
            });
        }
        const totalTasks = tasks.length;

        // Return task details
        res.status(200).json({
            message: "Tasks retrieved successfully",
            totalTasks: totalTasks,
            tasks,
        });
    } catch (error) {
        console.error("Error in getUserTasks:", error.message);
        res.status(500).json({
            message: `Failed to fetch tasks: ${error.message}`,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userRole = req.user.role; // Assume role is extracted from JWT middleware

        // Restrict access to managers and team-leads
        if (!["manager", "team-lead"].includes(userRole)) {
            return res.status(403).json({
                message: "Access denied! Only Managers and Team Leads can delete tasks.",
            });
        }

        // Find the task and delete it
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne(); // Delete the task
        res.status(200).json({
            message: "Task deleted successfully",
            taskId,
        });
    } catch (error) {
        console.error("Error in deleteTask:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export default { createTask, updateTaskStatus , deleteTask ,startTask, endTask, getUserTasks };
