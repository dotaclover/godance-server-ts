import axios from 'axios';
import { PostModel, initPostModel } from '../../src/models/PostModel';
import { getSequelizeInstance, connectDatabase } from '../../src/startup/database';

async function fetchAndInsertPosts() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const posts = response.data;
        // Get Sequelize instance and initialize PostModel
        const sequelize = getSequelizeInstance();
        if (!sequelize)
            throw new Error('Sequelize instance not initialized');

        initPostModel(sequelize);
        await sequelize.sync();
        await PostModel.bulkCreate(posts);
        console.log('Data inserted successfully!');
    } catch (error) {
        console.error('Error fetching or inserting data:', error);
    }
}

connectDatabase().then(() => {
    fetchAndInsertPosts();
}).catch(error => {
    console.error('Failed to connect to the database:', error);
});

