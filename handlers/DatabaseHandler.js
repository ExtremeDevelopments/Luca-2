const config = require(`../config.json`)
const mongoose = require("mongoose");
const { Channel, Client } = require("discord.js");
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
        modID: { type: String }
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
   * @param {string[]} options Options to create log
   */
  createLog(options) {

  }

  /**
   * Get the guild from the DB
   * @param {string} id the guild id
   */
  async getGuild(id) {
    const config = this.models.guild_config.findOne({ id }).lean()
    if (config) return config;
    return {
      id,
      prefix: '-',
      options: {
        embed: true,
        no_permissions: false,
      },
      starboard: {
        minimum: 3,
        channel: null,
      },
      moderation: {
        log_channel: null
      }
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
    return channel || null;
  }
  /**
   * Get the amount of cases in a server.
   * @param {string} id Guild ID
   */
  async getCaseCount(id) {
    const data = await this.models.moderation.find({ guildID: id })
    return data.size === 0 ? 1 : data.size
  }

}

module.exports = DatabaseHandler;
