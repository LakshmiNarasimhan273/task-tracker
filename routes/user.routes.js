import express from "express";
import userController from "../controller/user.controller.js";

const router = express();

router.post("/register", userController.registerApi);

export default router;