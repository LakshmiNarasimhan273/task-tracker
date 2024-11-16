import mongoose from "mongoose";
const taskSchema = mongoose.Schema({
    taskTitle: {
        type: String,
        required: true
    },
    taskPriority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high", "blocker"]
    },
    taskDescription: {
        type: String,
        required: true,
        minLength: 40
    },
    taskStatus: {
        type: String,
        required: true,
        enum: ["assigned", "in-progress", "qc-assigned", "qc-completed"],
        default: "assigned"
    },
    assignedPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        default: null
    }, // When the task work begins
    endTime: {
        type: Date,
        default: null
    },   // When the task work ends
    timeSpent: {
        type: Number,
        default: 0
    },  // Total time spent (in seconds)
});

// Method to calculate time spent
taskSchema.methods.calculateTimeSpent = function () {
    if (this.startTime && this.endTime) {
        const timeDiff = (this.endTime - this.startTime) / 1000; // Convert milliseconds to seconds
        this.timeSpent = Math.round(timeDiff);
    }
};

// In task.model.js
const Task = mongoose.model("Task", taskSchema);
export default Task;
