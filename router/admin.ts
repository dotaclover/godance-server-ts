import admin from '../controllers/admin';
import auth from "../middleware/auth";

//
import express from "express";
const router = express.Router();

//
router.post("/login", admin.login);
router.get("/me", auth, admin.getInfo);

//
export default router;