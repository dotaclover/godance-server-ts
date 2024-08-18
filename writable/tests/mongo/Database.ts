import { Document, Model } from "mongoose";
import winston from "winston";

class Database {
    /**
     * Create a new document.
     * @param {Model<T>} Model - The Mongoose model.
     * @param {Partial<T>} data - The data to create the document with.
     * @returns {Promise<T>} The created document.
     */
    async create<T extends Document>(Model: Model<T>, data: Partial<T>): Promise<T> {
        try {
            const document = new Model(data);
            return await document.save();
        } catch (err) {
            winston.error(err);
            throw err;
        }
    }

    /**
     * Get a single document.
     * @param {Model<T>} Model - The Mongoose model.
     * @param {object} query - The query to find the document.
     * @returns {Promise<T | null>} The found document or null if not found.
     */
    async getOne<T extends Document>(Model: Model<T>, query: object): Promise<T | null> {
        try {
            return await Model.findOne(query).exec();
        } catch (err) {
            winston.error(err);
            throw err;
        }
    }

    /**
     * Get a list of documents.
     * @param {Model<T>} Model - The Mongoose model.
     * @param {object} query - The query to find the documents.
     * @param {object} [options] - Optional query options.
     * @returns {Promise<T[]>} The list of found documents.
     */
    async getList<T extends Document>(Model: Model<T>, query: object, options: object = {}): Promise<T[]> {
        try {
            return await Model.find(query, null, options).exec();
        } catch (err) {
            winston.error(err);
            throw err;
        }
    }

    /**
     * Update a document.
     * @param {Model<T>} Model - The Mongoose model.
     * @param {object} query - The query to find the document.
     * @param {object} updateData - The data to update the document with.
     * @returns {Promise<T | null>} The updated document or null if not found.
     */
    async update<T extends Document>(Model: Model<T>, query: object, updateData: object): Promise<T | null> {
        try {
            return await Model.findOneAndUpdate(query, updateData, { new: true }).exec();
        } catch (err) {
            winston.error(err);
            throw err;
        }
    }

    /**
     * Delete a document.
     * @param {Model<T>} Model - The Mongoose model.
     * @param {object} query - The query to find the document.
     * @returns {Promise<T | null>} The deleted document or null if not found.
     */
    async delete<T extends Document>(Model: Model<T>, query: object): Promise<T | null> {
        try {
            return await Model.findOneAndDelete(query).exec();
        } catch (err) {
            winston.error(err);
            throw err;
        }
    }
}

export default Database;
