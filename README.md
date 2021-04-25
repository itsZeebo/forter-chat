# Forter Demo Chat

This is a little chat developed using lit, express, socket.io and elasticsearch.
The chat also has a bot that answer previously asked questions by indexing all questions to elasticsearch then analyzing incoming messages.

## Getting started

### Prerequisites

- [node.js (preferably v14 and up)](https://nodejs.org)

### Install the dependencies

Install the dependencies both on the server and client.

Under the root folder, simply run:

    npm install

Then,

    cd server
    npm install

### Start the development server

This command serves the app at `http://localhost:8000`:

    npm start

The command will also start the express server at `http://localhost:8001`

You can run the only server manually by using this command on the "server" directory

    npm run start:dev
