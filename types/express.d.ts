import * as express from 'express';

declare global {
    interface User {
        id: number;
        isAdmin: boolean;
    }

    namespace Express {
        interface Request {
            user: User;
        }
    }
}
