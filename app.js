require('dotenv').config();

const Server = require('./models/server_model');
const server = new Server();

server.listen();

module.exports = server;