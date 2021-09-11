// Run using: [Environment]::SetEnvironmentVariable("DEBUG","express:*"); & npm run devstart
require('dotenv').config();

const express = require('express');
const logger = require('morgan');

const app = express();

// Add morgan logger
app.use(logger('dev'));

app.get('/', (req, res, next) => {
    res.send('Hello squirrel');
});

app.listen(process.env.port, () => {
    console.log(`App listening on ${process.env.port}`);
});