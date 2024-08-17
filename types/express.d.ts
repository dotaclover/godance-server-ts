import * as express from 'express';
import { User } from '../src/types';

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}