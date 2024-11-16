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


export default { createTask, startTask, endTask, getUserTasks };
