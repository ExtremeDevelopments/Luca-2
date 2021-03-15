const { Message } = require("discord.js");
const Command = require("../../classes/Command");
class ModChannel extends Command {
  /**
   * Configure moderation channel
   * @param {Message} message 
   * @param {string[]} args 
   */
  async run(message, args) {
    const channel = message.guild.channels.cache.get((args[0] || '').replace(/[<@#>]/g, ''))
    if(channel) {
      this.client.db.setModLogChannel(message.guild.id, channel);
      message.channel.send(this.embeds.error(`<:tickYes:821126043485732874> Succesfully changed moderation channel.`));
    } else {
      message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> Uhm... Could you try again? I can't find that channel.`))
    }
  }
  get name() {
    return 'modchannel'
  }
  get aliases() {
    return ['mc']
  }
  get permissions() {
    return ['MANAGE_GUILD']
  }
  get category() {
    return 'configuration'
  }
  get example() {
    return 'modchannel #mod-log'
  }
  get usage() {
    return '-modchannel <channel mention | channel ID>'
  }
  

}
module.exports = ModChannel;