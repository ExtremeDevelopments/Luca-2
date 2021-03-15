const EventEmitter = require("node:events");
const Luca = require("./Luca");

class Event extends EventEmitter {
  /**
   * 
   * @param {Luca} client Client initiating it.
   */
  constructor(client) {
    super();
    this.client = client;

    if (this.constructor === Event) throw new Error('Event Handler attempted to access event through main class file');
  }

  /**
   * very important code
   * @param {string[]} args Arguments for event.
   */
  exec(...args) {
    this.run(...args).catch(err => this.emit('error', err))
  }

  get once() {
    return false;
  }

  get event() {
    throw new Error('No event was assigned')
  }
}
module.exports = Event;