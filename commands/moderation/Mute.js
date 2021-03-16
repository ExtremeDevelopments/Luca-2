const Command = require("../../classes/Command");

class Mute extends Command {
  /**
   * Configure moderation channel
   * @param {Message} message 
   * @param {string[]} args 
   */
  async run(message, args) {
    const member = message.guild.members.cache.get((args[0] || '').replace(/[<@!>]/g, ''))
    if (member) {
      if (member.roles.highest < message.member.roles.highest) return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> You cannot do this.`));
      try {
        //Checks
        let caseNum = await this.client.db.getCaseCount(message.guild.id) + 1
        let reason = `Moderator: please do \`-reason ${caseNum}\``;
        if (args.length >= 2) reason = args.slice(2).join(` `);

        const role = await this.client.db.getMuteRole(this.client, message.guild)
        if (!role.editable) return message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> I cannot mute this member.`));
        member.roles.add(role)
        //Finalize
        const channel = await this.client.db.getLogChannel(this.client, message.guild.id);
        let msg;
        if (channel) msg = await channel.send(await this.embeds.mute(message, member, message.member, reason));
        this.client.db.createLog(member, message.member, message.guild, reason, caseNum, 'MUTE', msg)
        message.channel.send(new MessageEmbed().setDescription(`🤐 Muted ${member.user.tag} (${member})`));
      } catch (err) {
        message.channel.send(this.embeds.error(`<:tickNo:821117686905438209> An error occured.`))
      }
    }
  }
  get name() {
    return 'mute'
  }
  get aliases() {
    return ['m']
  }
  get permissions() {
    return ['MANAGE_ROLES', 'MANAGE_MESSAGES']
  }
  get category() {
    return 'moderation'
  }
  get example() {
    return 'mute @Extreme#1000'
  }
  get usage() {
    return '-mute <mention | user ID> [reason]'
  }
}
module.exports = Mute;