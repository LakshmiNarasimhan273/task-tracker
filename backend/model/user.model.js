import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 5,
        },
        role: {
            type: String,
            required: true,
            enum: ["manager", "team-lead", "developer", "tester"],
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User;
