import { describe, expect, test, it, beforeEach, afterEach } from '@jest/globals';
import mongo from '../lib/mongoose';
import mongoose from "mongoose";

describe("test mongoose", () => {
    afterEach(async () => {
        await mongoose.disconnect();
    });

    describe('connect', () => {
        it("should return mongodb objectId", async () => {
            const result = await mongo.hello();
            expect(result).toBeTruthy();
        })
    });
});