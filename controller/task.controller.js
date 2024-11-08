import User from "../model/user.model.js";
import task from "../model/task.model.js";

const createTask = async (req, res) => {
    try{
        const {taskTitle, taskPriority, taskDescription, taskStatus, assignedPerson, dueDate} = req.body;

        const user = await User.findById(req.user.userId);
        // condition to check the logged user role is manager or team-leads, if it's not matched the access
        // should be denied
        if(user.role !== "manager" && user.role !== "team-lead"){
            return res.status(403).json({ message: "Access denied!, only Managers and Team leads are able to create a new task" });
        }

        const newTask = new task({
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
        console.error(err);
        
        res.status(500).json({ message: "Task creation un-successful" });
    }
}

export default {createTask};