const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const {readdirSync} = require('fs');
const logger = require('./schedulers/logger');
const handleRecurringTransactions = require('./schedulers/scheduler');

const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true // If you need to include cookies or authentication tokens
}));

//routes
readdirSync('./routes').map((r) => app.use('/api/v1', require(`./routes/${r}`))); // this line of code will automatically import all the routes from the routes folder


// tracing
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const server = () => {
    db().then(() => {
        logger.info('Connected to the database');
    
        // Start the cron job after successful DB connection
        handleRecurringTransactions();

        // Start HTTP server after DB connection
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}... 🚀`);
        });
    }).catch((error) => {
        logger.error(`Database connection error: ${error.message}`);
        process.exit(1);
    });
}

server()