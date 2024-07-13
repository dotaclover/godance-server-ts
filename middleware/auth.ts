import { NextFunction, Request, Response } from "express";
import jwt from "../utils/jwt";

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token);
    req.user = decoded as User;
    next();
  } catch (ex) {
    if (ex instanceof Error)
      return res.status(400).send(ex.message);
    res.status(400).send("Invalid token.");
  }
}
