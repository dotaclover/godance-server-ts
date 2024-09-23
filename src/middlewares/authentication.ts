import { Request, Response, NextFunction } from "express";
import jwt from "../library/jwt";
import { User } from "../types";

const authentication = function (req: Request, res: Response, next: NextFunction) {
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

export default authentication;
