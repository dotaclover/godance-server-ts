import { NextFunction, Request, Response } from "express";
import winston from "winston";
export default function handleAsync(handler: Function) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            if (ex instanceof Error)
                winston.error(ex.message, ex);

            if (process.env.NODE_ENV === 'production') {
                res.status(500).send("Something go wrong.");
                return;
            }
            next(ex);
        }
    };
}