import express from "express";
import userController from "../controller/user.controller.js";
import isRole from "../middleware/roleMiddleware.js";

const router = express();

router.post("/register", userController.registerApi);
router.post("/login", userController.loginApi);


export default router;