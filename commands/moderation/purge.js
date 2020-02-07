import Command from 'core/Command'

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      description: 'Purge messages',
      usage: 'purge',
      category: 'moderation',
      aliases: ['c', 'clear', 'prune'],
      permLevel: 5,
      permission: 'READ_MESSAGES'
    })
  }

  run = () => {
    super.sendMessage('Not implemented yet.')
  }
}