import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoConnection from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Centeralized error-handling to catch uncaught errors
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});


mongoConnection().then(() => {
    app.listen(port, () => console.log(`Server up and running on port http://localhost:${port}`)
    );
}).catch(() => console.error("Internal server error")
);

