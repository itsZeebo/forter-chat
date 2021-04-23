require('dotenv').config();

const express = require('express');
const http = require('http');
const { initClient } = require('./providers/elasticsearch');
const { initSocketServer } = require('./providers/socket');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.use(express.static('dist'));

initClient();
initSocketServer(server);

app.get('/', (req, res) => res.send('./dist/index.html'));

app.listen(port, () => console.log(`Running on port ${port}`));
