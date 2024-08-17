import { Document, Model } from "mongoose";
import Database from "./Database";

class EntityDatabase<T extends Document> {
    private model: Model<T>;
    private database: Database;

    constructor(model: Model<T>) {
        this.model = model;
        this.database = new Database();
    }

    /**
     * Create a new document.
     * @param {Partial<T>} data - The data to create the document with.
     * @returns {Promise<T>} The created document.
     */
    async create(data: Partial<T>): Promise<T> {
        return this.database.create(this.model, data);
    }

    /**
     * Get a single document.
     * @param {object} query - The query to find the document.
     * @returns {Promise<T | null>} The found document or null if not found.
     */
    async getOne(query: object): Promise<T | null> {
        return this.database.getOne(this.model, query);
    }

    /**
     * Get a list of documents.
     * @param {object} query - The query to find the documents.
     * @param {object} [options] - Optional query options.
     * @returns {Promise<T[]>} The list of found documents.
     */
    async getList(query: object, options: object = {}): Promise<T[]> {
        return this.database.getList(this.model, query, options);
    }

    /**
     * Update a document.
     * @param {object} query - The query to find the document.
     * @param {object} updateData - The data to update the document with.
     * @returns {Promise<T | null>} The updated document or null if not found.
     */
    async update(query: object, updateData: object): Promise<T | null> {
        return this.database.update(this.model, query, updateData);
    }

    /**
     * Delete a document.
     * @param {object} query - The query to find the document.
     * @returns {Promise<T | null>} The deleted document or null if not found.
     */
    async delete(query: object): Promise<T | null> {
        return this.database.delete(this.model, query);
    }
}

export default EntityDatabase;
