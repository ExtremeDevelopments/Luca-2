const { Message, MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");

class Ban extends Command {
  /**
   * idk man
   * @param {Message} message
   * @param {string[]} args
   */
  run(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (member) {
      if (!member.bannable) return message.channel.send(new MessageEmbed().setDescription(`:tickNo: I cannot ban this member.`).setColor(`GREY`));
      try {
        const channel = await this.client.db.getLogChannel(this.client, message.id)
        channel.send(this.embeds.mute(message, member, message.member))
      } catch (err) {

      }
    } else {
      return message.channel.send(new MessageEmbed().setDescription(`:tickNo: Uhm... Could you try again? I didn't get who I need to ban.`).setColor(`GREY`)); //Fix tickno before release
    }
  }

  get name() {
    return 'ban'
  }

  get aliases() {
    return ['b', 'bonk']
  }

  get botPermissions() {
    return ['BAN_MEMBERS']
  }

  get permissions() {
    return ['BAN_MEMBERS']
  }

  get usage() {
    return '-ban <mention | user ID> [reason]'
  }

  get category() {
    return 'moderation'
  }

  get example() {
    return 'ban @Extreme bonk' + '\n' +
      'ban 300438546236571658 stinky'
  }

  get owner() {
    return false;
  }
}
module.exports = Ban;