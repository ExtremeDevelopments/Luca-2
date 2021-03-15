const config = require(`../config.json`)
const mongoose = require("mongoose");
const { Channel, GuildMember, Guild } = require("discord.js");
const Luca = require("../classes/Luca");

class DatabaseHandler {
  constructor(client) {
    this.init().catch((err) => console.error(err))
    this.schemas = {
      moderation: new mongoose.Schema({
        guildID: { type: String, required: true },
        userID: { type: String, required: true },
        case: { type: Number, required: true }, //Case ID
        type: { type: String, required: true }, // ['BAN', 'UNBAN', 'KICK', 'MUTE', 'UNMUTE']
        modID: { type: String },
        reason: { type: String }
      }),

      starboard: new mongoose.Schema({
        channelID: { type: String, required: true },
        messageID: { type: String, required: true },
        star_count: { type: Number, default: 1 },
      }),

      guild_config: new mongoose.Schema({
        id: { type: String, required: true, unique: true },
        prefix: { type: String, default: '-' },
        options: {
          embed: { type: Boolean, default: true },
          no_permissions: { type: Boolean, default: false },
        },
        starboard: {
          minimum: { type: Number, default: 3 },
          channel: { type: String, default: null }
        },
        moderation: {
          log_channel: { type: String, default: null }
        },
        toggles: {
          bans: { type: Boolean, default: true },
          unbans: { type: Boolean, default: true },
          mutes: { type: Boolean, default: true },
          unmutes: { type: Boolean, default: true },
          kicks: { type: Boolean, default: true },
        }
      }),

      user_config: new mongoose.Schema({
        id: { type: String, required: true, unique: true },
        nostar: { type: Boolean }
      }),
    }

    this.models = {
      moderation: mongoose.model('guilds.moderation', this.schemas.moderation),
      starboard: mongoose.model('guilds.starboard', this.schemas.starboard),
      guild_config: mongoose.model('guilds.config', this.schemas.guild_config),
      user_config: mongoose.model('users.config', this.schemas.user_config)
    }
  }

  async init() {
    await mongoose.connect(config.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  /**
   * 
   * @param {string[]} caseID Options to delete log
   */
  deleteLog(caseID) {

  }
  /**
   * 
   * @param {GuildMember} member 
   * @param {GuildMember} moderation 
   * @param {Guild} guild
   * @param {string} reason 
   */
  createLog(member, moderator, guild, reason, caseNum, modtype) {
    const schema = new this.models.moderation({
      guildID: guild.id,
      userID: member.id,
      modID: moderator.id || null,
      case: caseNum,
      type: modtype,
      reason: reason
    })
    schema.save()
    return schema;
  }

  /**
   * Get the guild from the DB
   * @param {string} gid the guild id
   */
  async getGuild(gid) {
    if(!gid) throw new Error(`Must include ID`)
    const conf = await this.models.guild_config.findOne({ id: gid })
    if (conf.id === gid) {
      return conf;
    } else if(conf === null) {
      return new this.models.guild_config();
    }
  }

  /**
   * Get the guild prefix
   * @param {string} id the guild's ID
   */
  async getPrefix(id) {
    const data = await this.getGuild(id)
    return data.prefix;
  }

  /**
   * Get the guild's options
   * @param {string} id the guild's id
   */
  async getOptions(id) {
    const data = await this.getGuild(id);
    return data.options;
  }
  /**
   * Get logging channel for moderation events.
   * @param {Luca} client Client object
   * @param {string} id guild ID
   * @returns {Channel} Channel object.
   */
  async getLogChannel(client, id) {
    const data = await this.getGuild(id);
    const channel = client.channels.cache.get(data.moderation.log_channel)
    return channel;
  }
  /**
   * Get the amount of cases in a server.
   * @param {string} id Guild ID
   */
  async getCaseCount(id) {
    const data = await this.models.moderation.find({ guildID: id })
    if(!data) return 1;
    if(data) return data.length;
  }
  /**
   * 
   * @param {string} id 
   * @param {Channel} channel 
   */
  async setModLogChannel(id, channel) {
    const data = await this.getGuild(id);
    data.moderation.log_channel = channel.id;
    data.id = id;
    data.save();
    return data;
  }

}

module.exports = DatabaseHandler;
