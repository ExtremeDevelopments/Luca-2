const { Client } = require('discord.js');

// Handlers
const CommandHandler = require('../handlers/CommandHandler');
const DatabaseHandler = require('../handlers/DatabaseHandler');
const EventHandler = require('../handlers/EventHandler');

class Luca extends Client {
  /**
   * A Luca 2 client
   * 
   * @param {string} token The bot's token
   * @param {ClientOptions} options Client options
   */
  constructor(token, options) {
    super(options);
    this.token = token;
    this.options.partials = ['MESSAGE']
  }

  /**
   * Start the bot
   */
  startup() {
    //Startup handlers
    this.db = new DatabaseHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this)

    // Login yea
    this.login(this.token)
  }
}

module.exports = Luca
