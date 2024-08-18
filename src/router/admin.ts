import admin from '../controllers/admin';
import auth from "../middlewares/auth";

//
import express from "express";
const router = express.Router();

//
router.post("/login", admin.login);
router.get("/me", auth, admin.getInfo);

//
export default router;