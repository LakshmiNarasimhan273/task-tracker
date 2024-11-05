import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoConnection from "./config/db.js";
import router from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/api/user", router);
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoConnection().then(() => {
    app.listen(port, () => console.log(`Server up and running on port http://localhost:${port}`)
    );
}).catch(() => console.error("Internal server error")
);

