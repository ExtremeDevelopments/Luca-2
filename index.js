const Client = require('./classes/Luca');
const config = require(`./config.json`)
const client = new Client(config.token);
client.startup();