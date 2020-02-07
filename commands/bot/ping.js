import Command from 'core/Command'

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Ping the bot',
      usage: 'ping',
      category: 'bot',
      aliases: ['pong', 'prout'],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = () => {
    super.sendMessage(':ping_pong:')
    this.client.logger.sendLogMessage('ping')
  }
}