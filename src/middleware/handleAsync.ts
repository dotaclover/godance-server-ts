import { Request, Response, NextFunction } from "express";
import winston from "winston";

const handleAsync = function (handler: Function) {
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

export default handleAsync;