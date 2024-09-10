import user from '../controllers/user';
import auth from "../middlewares/auth";

//
import express from "express";
const router = express.Router();

//
router.post("/login", user.login);
router.get("/me", auth, user.getInfo);

//
export default router;