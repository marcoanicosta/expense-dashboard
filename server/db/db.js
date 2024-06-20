const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('Database connected successfully 🚀');
    } catch (error) {
        console.log('Database connection failed ❌', error);
    }
}

module.exports = db;