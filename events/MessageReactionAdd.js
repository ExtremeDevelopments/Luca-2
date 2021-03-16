const { MessageReaction, User } = require("discord.js");
const Event = require("../classes/Event");

class MessageReactionAdd extends Event {
  get name() {
    return 'messageReactionAdd'
  }
  get event() {
    return 'messageReactionAdd'
  }
  /**
   * @param {MessageReaction} reaction 
   * @param {User} user 
   */
  async run(reaction, user) {
    if(reaction.partial) {
      try {
        await reaction.fetch();
      } catch (err) {
        console.log(`Hm couldn't fetch`, err)

        return;
      }
    }
    // if(reaction.message.author.id === user.id) return reaction.remove();
    this.client.starboard.addStar(reaction, user)
  }
}
module.exports = MessageReactionAdd