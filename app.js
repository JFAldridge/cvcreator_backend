const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res, next) => {
    res.send('Hello squirrel');
});

app.listen(port, () => {
    console.log(`App listening on ${port}`);
});