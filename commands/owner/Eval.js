const Command = require("../../classes/Command");
const { inspect } = require(`util`);
class Eval extends Command {
  trim(string, max) {
    return string.length > max ? string.slice(0, max)[0] : string;
  }
  async run(message, args) {
    this.commandHandler = this.client.commandHandler;
    this.eventHandler = this.client.eventHandler;
    this.databaseHandler = this.client.db;
    
    let output;
    let status = true;

    try {
      const toEval = args.join(' ').replace(/token/g, 'mem')
      let evaled = eval(toEval)

      if (evaled instanceof Promise) evaled = await evaled
      evaled = typeof evaled !== 'string' ? inspect(evaled) : evaled

      output = evaled.split(this.client.token).join('[TOKEN REMOVED]')
    } catch (err) {
      status = false
      output = err.toString()
    }

    try {
      await message.channel.send({
        embed: {
          author: {
            name: '| Output',
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          },
          description: `\`\`\`js\n${output.split('```').join('\\`\\`\\`')}\`\`\``, //this.trim(output, 2000)
          color: '#00FF00'
        }
      })
    } catch (e) {
      await message.channel.send({
        embed: {
          author: {
            name: '| Output',
            iconURL: message.author.displayAvatarURL({ dynamic: true })
            
          },
          description: `\`\`\`${e.toString()}\`\`\``,
          color: 16711680
        }
      })
    }
  }
  get name() {
    return 'eval'
  }
  get aliases() {
    return ['ev']
  }
}
module.exports = Eval;