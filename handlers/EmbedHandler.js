const { MessageEmbed, GuildMember, Message } = require("discord.js");
const Luca = require("../classes/Luca");
class EmbedHandler {
  /**
   * @param {Luca} client Client object
  */
  constructor(client) {
    this.client = client;
  }
  /**
   * @param {Message} message Message object
   * @param {GuildMember} member Member being banned
   * @param {GuildMember} moderator Moderator
   */
  ban(message, member, moderator) {
    const caseNum = await this.client.db.getCaseCount(message.guild.id)
    const embed = new MessageEmbed()
    .setTitle(`Ban | Case ${caseNum}`)
    .addFields(
      { name: "User", value: member.user.tag + ` (${member})`, inline: true},
      { name: "Moderator", value: moderator.user.tag }
    )
    .setTimestamp()
    return embed;
  }
}