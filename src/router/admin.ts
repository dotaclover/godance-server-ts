import admin from '../controllers/admin';
import handleAsync from '../middleware/async';
import auth from "../middleware/auth";

//
import express from "express";
const router = express.Router();

//
router.post("/login", handleAsync(admin.login));
router.get("/me", auth, handleAsync(admin.getInfo));

//
export default router;