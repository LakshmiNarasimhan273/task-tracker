import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    taskTitle: {
        type: String,
        required: true,
    },
    taskPriority: {
        type: String,
        required: true,
        enum: ["low" ,"medium", "high", "blocker"]
    },
    taskDescription: {
        type: String,
        required: true,
        minLength: 40,
    },
    taskStatus: {
        type: String,
        required: true,
        enum:["assigned", "in-progress", "qc-assigned", "qc-completed"]
    },
    assignedPerson: {
        type: String,
        required: true,
        index: true
    },
    // Need to add a indidual task timer
    assignedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value){
                return value > this.assignedDate;
            },
            message: "Due date must be after the assigned date."
        }
    }
});

taskSchema.pre('save', async function (next) {
    const user = await mongoose.model("User").findOne({ username: this.assignedPerson });

    if(!user){
        return next(new Error("Assigned person not found in user collection"));
    }
    next();
});

const task = mongoose.model("Task", taskSchema);
export default task;    