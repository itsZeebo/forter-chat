require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { initClient } = require('./providers/elasticsearch');
const { initSocketServer } = require('./providers/socket');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('dist'));
app.use(cors());

app.get('/', (req, res) => res.send('./dist/index.html'));

const server = http.createServer(app);

initClient();
initSocketServer(server);

server.listen(port, () => 'App running on port ' + port);
