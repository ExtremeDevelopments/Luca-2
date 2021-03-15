const { MessageEmbed, GuildMember, Message } = require("discord.js");
const Luca = require("../classes/Luca");
class EmbedHandler {
  /**
   * Embed
   * @param {Luca} client Client object
  */
  constructor(client) {
    this.client = client;
  }
  /**
   * Ban embed
   * @param {Message} message Message object
   * @param {GuildMember} member Member being banned
   * @param {GuildMember} moderator Moderator
   */
  async ban(message, member, moderator, reason) {
    const caseNum = await this.client.db.getCaseCount(message.guild.id) + 1
    const embed = new MessageEmbed()
    .setTitle(`Ban | Case #${caseNum}`)
    .addFields(
      { name: "User", value: member.user.tag + ` (${member})`, inline: true},
      { name: "Moderator", value: moderator.user.tag },
      { name: "Reason", value: reason }
    )
    .setColor(`RED`)
    .setTimestamp();
    return embed;
  }
  /**
   * Error embed
   * @param {string} reason Reason of error.
   */
  error(reason) {
    const embed = new MessageEmbed()
    .setDescription(reason)
    .setColor(`#36393f`)
    return embed;
  }
}
module.exports = EmbedHandler;