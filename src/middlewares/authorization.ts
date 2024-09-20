import { Request, Response, NextFunction } from "express";
import authentication from "./authentication";
import userService from "../services/Logic/userService";
const authorization = async function (req: Request, res: Response, next: NextFunction) {
  authentication(req, res, async () => {
    if (!req.user)
      return res.status(401).send("Access denied. No token provided.");

    try {
      const user = await userService.getById(req.user.id);
      if (!user?.isAdmin)
        return res.status(403).send("Forbidden. No Permission to Access");
      next();

    } catch (err) {
      console.log(err)
      return res.status(500).send("Internal error.");
    }
  });
}

export default authorization;
