const { Message, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { resolve, join } = require('path')

const Command = require("../classes/Command");
const Luca = require("../classes/Luca");

class CommandHandler {
  /**
   * @param {Luca} client pog
   */
  constructor(client) {
    this.client = client;
    this.client.on('message', this.exec.bind(this))

    this.commands = new Map();
    this.aliases = new Map();

    this.build();
  }

  /**
   * Load commands
   */
  build() {
    if (this.built) return console.log(`Command handler already built`);
    const folders = readdirSync(resolve(__dirname, '../commands'), { withFileTypes: true })
    for (const folder of folders) {
      const files = readdirSync(resolve(__dirname, '../commands', folder.name), { withFileTypes: true})
      for (const file of files) {
        const command = new (require(resolve(__dirname, '../commands', folder.name, file.name)))(this.client);
        this.commands.set(command.name, command)
        for (const alias of command.aliases) {
          this.aliases.set(alias, command)
        }
      }
    }
    console.log(`Loaded ${this.commands.size} commands`)
    this.built = true;
  }
  
  /**
   * Rebuild?
   */
  rebuild() {
    this.built = false;
    this.build();
  }

  /**
   * Get the command
   * @param {string} command bro this is a command or an alias tho
   */
  get(command) {
    return this.commands.get(command) || this.aliases.get(command);
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

  async exec(msg) {
    if (msg.author.bot) return;
    const prefix = await this.client.db.getPrefix(msg.guild.id)

    let args = msg.content.slice(prefix.length).trim().split(/\s+/g);
    let cmd = args.shift().toLowerCase();
    if (msg.content.startsWith(prefix)) {
      const command = this.get(cmd)
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
  }
}

module.exports = CommandHandler;