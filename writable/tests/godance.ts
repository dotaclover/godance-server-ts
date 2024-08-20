import axios from 'axios';

import config from 'config';
import { PostMongo } from '../../src/mongo/PostMongo';
import { PostModel } from '../../src/models/PostModel';
import { geDBInstance, connectDatabase } from '../../src/services/database';

async function fetchAndInsertPosts() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const posts = response.data;
        // Get Sequelize instance and initialize PostModel
        geDBInstance().then(async (sequelize) => {
            await sequelize.sync();
            await PostModel.bulkCreate(posts);
            console.log('Data inserted successfully!');
        });

    } catch (error) {
        console.error('Error fetching or inserting data:', error);
    }
}

async function fetchAndInsertMongoPosts() {
    try {
        // Fetch data from the API
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const posts = response.data;

        // Insert the data into the MongoDB
        await PostMongo.insertMany(posts);

        console.log('Data inserted successfully!');
    } catch (error) {
        console.error('Error fetching or inserting data:', error);
    }
}

connectDatabase().then(() => {
    if (config.get("database.type") === "mongodb")
        fetchAndInsertMongoPosts();
    else
        fetchAndInsertPosts();
}).catch(error => {
    console.error('Failed to connect to the database:', error);
});

