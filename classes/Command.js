class Command {
  constructor(client) {
    this.client = client;
    this.embeds = new EmbedHandler(this)
    if (this.constructor === Command) throw new Error(`Command Handler started Command class directly.`);
  }

  run() {
    throw new Error('Method not implented')
  }

  get name() {
    throw new Error('No name was assigned')
  }

  get aliases() {
    return []
  }

  get botPermissions() {
    return [];
  }

  get permissions() {
    return [];
  }

  get usage() {
    return 'none';
  }

  get category() {
    return 'none';
  }

  get example() {
    return 'none'
  }

  get owner() {
    return false;
  }
}

module.exports = Command;