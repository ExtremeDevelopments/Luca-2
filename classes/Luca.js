const { Client } = require('discord.js');

// Handlers
const CommandHandler = require('../handlers/CommandHandler');
const DatabaseHandler = require('../handlers/DatabaseHandler')

class Luca extends Client {
  /**
   * A Luca 2 client
   * 
   * ~~use discord-rose~~
   * @param {string} token The bot's token
   * @param {ClientOptions} options Client options
   */
  constructor(token, options) {
    super(options);
    this.token = token;
  }

  /**
   * Start the bot
   */
  startup() {
    // Handlers????
    this.db = new DatabaseHandler(this);
    this.commandHandler = new CommandHandler(this);

    // Login yea
    this.login(this.token)
  }
}

module.exports = Luca
