const { Message, MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");

class Ban extends Command {
  /**
   * idk man
   * @param {Message} message
   * @param {string[]} args
   */
  async run(message, args) {
    const member = message.guild.members.cache.get((args[0] || '').replace(/[<@!>]/g, ''))

    if (member) {
      if (!member.bannable) return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> I cannot ban this member.`));
      if(member.roles.highest < message.member.roles.highest) return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> You cannot do this.`));
      try {
        
        let caseNum = await this.client.db.getCaseCount(message.guild.id) + 1
        let reason = `Moderator: please do \`-reason ${caseNum}\``;
        if (args.length >= 2) reason = args.slice(2).join(` `);
        
        const channel = await this.client.db.getLogChannel(this.client, message.guild.id);
        let msg;
        if (channel) msg = await channel.send(await this.embeds.ban(message, member, message.member, reason));
        member.ban()
        this.client.db.createLog(member, message.member, message.guild, reason, caseNum, 'BAN', msg)
        message.channel.send(new MessageEmbed().setDescription(`<:banHammer:821162351507669043> banned ${member.user.tag} (${member})`));
      } catch (err) {
        console.log(err)
        message.channel.send(this.embeds.error('<:tickNo:821117686905438209> A error occured...'))
      }
    } else {
      return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> Uhm... Could you try again? I didn't get who I need to ban.`)); //Fix tickno before release
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