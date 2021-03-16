const { MessageReaction, User, MessageEmbed } = require("discord.js");
const Luca = require("./Luca");

class Starboard {
  /**
   * Starboard constructor
   * @param {Luca} client 
   */
  constructor(client) {
    this.client = client;
    this.db = client.db;
  }
  /**
   * 
   * @param {MessageReaction} reaction 
   * @param {User} user 
   */
  async addStar(reaction, user) {
    const starconfig = await this.db.getStarConfig(reaction.message.guild.id);
    if(reaction.message.reactions.cache.size >= starconfig.minimum) {
    const star = await this.db.getStarred(reaction.message.id);
    if(star) {
      star.star_count = star.star_count + 1;
      star.save();
      const channel = this.client.channels.cache.get(star.channelID)
      if(!channel) return;
      const origin = channel.messages.fetch(star.messageID);
      const c = this.client.channels.cache.get(starconfig.channel)
      const message = c.messages.fetch(star.starMessageID)
      message.edit(`⭐ **${reaction.message.reactions.cache.size + origin.reactions.cache.size}** | ${message.channel}`)
    } else {
      const starboardchannel = this.client.channels.cache.get(starconfig.channel)
      const starembed = new MessageEmbed()
      .setAuthor(user.tag, user.displayAvatarURL({dynamic:true}))
      .setDescription(reaction.message.content)
      .setFooter(`ID: ${reaction.message.id}`)
      .setTimestamp()
      starboardchannel.send(`⭐ **${reaction.message.reactions.cache.size}** | ${reaction.message.channel}`, { embed: starembed })
    }
    }
  }
}
module.exports = Starboard;