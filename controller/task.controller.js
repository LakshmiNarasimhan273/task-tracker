import user from "../model/user.model.js";
import task from "../model/task.model.js";

const createTask = async (req, res) => {
    try{
        const {taskTitle, taskPriority, taskDescription, taskStatus, assignedPerson, dueDate} = req.body;

        const user = await user.findById({ req.user.userId });

        if(user.role !== "manager" && user.role !== "team-lead"){
            return res.status(403).json({ message: "Access denied!, only Managers and Team leads are able to create a new task" });
        }

        cosnt newTask = new task({
            taskTitle,
            taskPriority,
            taskDescription,
            taskStatus,
            assignedPerson,
            dueDate,
            assignedDate: new Date()
        });
        await newTask.save();
        res.status(200).json({ message: "Task created successfully" })
    }catch(err){
        res.status(500).json({ message: "Task creation un-successful" });
    }
}

export default {createTask};