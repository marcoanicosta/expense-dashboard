
const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const {readdirSync} = require('fs');

const app = express();
require('dotenv').config()
const PORT = process.env.PORT

//middlewares
app.use(express.json());
app.use(cors());

//routes
readdirSync('./routes').map((r) => app.use('/api/v1', require(`./routes/${r}`))); // this line of code will automatically import all the routes from the routes folder


const server = () => {
    db()
    app.listen(PORT, () => {
        console.log(`Server is liseting to port ${PORT}... 🚀`);
    })
}

server()