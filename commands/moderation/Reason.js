const { Message, MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");

class Reason extends Command {
  /**
   * idk man
   * @param {Message} message Message
   * @param {string[]} args arguments
   */
  async run(message, args) {

    const caseid = args[0]
    const reason = args.slice(1).join(' ')
    if (!caseid) return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> You didn't provide a case ID`))
    if (!reason) return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> You didn't provide a reason.`))
    const channel = await this.client.db.getLogChannel(this.client, message.guild.id);
    if (channel) {
      const logmsg = await this.client.db.getModLog(message.guild.id, caseid)
      const msg = await message.channel.messages.fetch(logmsg.messageID)
      const newembed = msg.embeds[0];
      newembed.fields[2].value = reason;
      msg.edit(newembed)
    }
  }

  get name() {
    return 'reason'
  }

  get aliases() {
    return ['r']
  }

  get permissions() {
    return ['MANAGE_MESSAGES']
  }

  get usage() {
    return '-reason <case ID> [reason]'
  }

  get category() {
    return 'moderation'
  }

  get example() {
    return 'reason 69 get beaned loser'
  }
}
module.exports = Reason;