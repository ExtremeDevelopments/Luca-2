const Luca = require("../classes/Luca");

// jdaoijwds
const { readdirSync } = require("fs");
const path = require('path');

/**
 * does this work?
 * oh pog it does lmao
 */
class EventHandler {
  /**
   * Bro this is a constructor lol
   * @param {Luca} client Client object.
   */
  constructor(client) {
    this.client = client;

    this.events = new Map();

    this.built = false;
    this.build();
  }

  /**
   * Load (build) the events
   */
  build() {
    if (this.built) return this;

    const events = readdirSync(path.resolve(__dirname, `../events`), { withFileTypes: true }) //readdirSync

    for (let event of events) { //Go through each file
      if (!event.isFile() || !event.name.endsWith('.js')) continue; //Check ending of file to make sure it is .js

      event = new (require(`../events/${event.name}`))(this.client); //Create the event's class file constructor.

      const exec = event.exec.bind(event); //Bing the execute event

      event.once ? this.client.once(event.name, exec) : this.client.on(event.name, exec); //Check if it is a on "once" or on "on"

      this.events.set(event.name, event); //Set into events in client.

      console.log(`🦻 Loaded event: ${event.name}`); //Log event being loaded

    }

    this.built = true; //Built is true in case of rebuild.
    console.log(`👂 All events loaded.`); //Complete
    return this; //Return
  }

  /**
   * Rebuild the stupid shit
   */
  rebuild() {
    this.built = false;
    this.build();
  }
}
module.exports = EventHandler;