// Run using: [Environment]::SetEnvironmentVariable("DEBUG","express:*"); & npm run devstart

const express = require('express');
const logger = require('morgan');

const app = express();

// Add morgan logger
app.use(logger('dev'));

const port = 3000;

app.get('/', (req, res, next) => {
    res.send('Hello squirrel');
});

app.listen(port, () => {
    console.log(`App listening on ${port}`);
});