const { Message, Client, MessageEmbed } = require("discord.js");

const Command = require("../classes/Command");
const Luca = require("../classes/Luca");

class CommandHandler {
  /**
   * @param {Luca} client pog
   */
  constructor(client) {
    this.client = client;
  }

  init() {
    this.client.on('message', async (msg) => {
      if (msg.author.bot) return;
      const prefix = await this.client.db.getPrefix(msg.guild.id)

      let args = msg.content.slice(prefix.length).trim().split(/\s+/g);
      let cmd = args.shift().toLowerCase();

      if (msg.content.startsWith(prefix)) {
        command = this.get(cmd);
        if (!command) return;
        if (command.permissions && !this.checkPerms(msg, command)) {
          if ((await this.client.db.getOptions()).no_permissions) {
            const embed = new MessageEmbed()
              .setAuthor('Missing Permissions')
              .setTitle(`Missing Permissions: ${command.permissions.join(', ')}`)
            msg.channel.send(embed)
          }
          return;
        }; 

        return await command.run(msg, args);
      }
    })
  }

  /**
   * Get the command
   * @param {string} command bro this is a command or an alias tho
   */
  get(command) {

  }

  /**
   * check the permsadjwijd
   * @param {Message} message message
   * @param {Command} command command
   */
  checkPerms(message, command) {
    // TODO: channel permissions
    return command.permissions.every(perm => message.member.hasPermission(perm))
  }

  /**
   * check the permsadjwijd
   * @param {Message} message message
   * @param {Command} command command
   */
  checkBotPerms(message, command) {
    // TODO: channel permissions
    return command.botPermissions.every(perm => message.guild.me.hasPermission(perm))
  }
}

module.exports = CommandHandler;