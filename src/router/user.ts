import user from '../controllers/user';
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

//
import express from "express";
const router = express.Router();

//
router.post("/login", user.login);
router.get("/me", authentication, user.getInfo);
router.get("/suspend", authorization, user.suspend);

//
export default router;