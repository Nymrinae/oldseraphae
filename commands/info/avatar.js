import Command from 'core/Command'

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      description: 'Display user avatar',
      usage: 'avatar',
      category: 'info',
      aliases: [],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = message => {
    const user = message.mentions.users.first() || message.author
    const options = {
      title: `Avatar of ${user.username}`,
      image: { url : user.avatarURL },
      footer: { text: 'Information - Avatar' }
    }

    super.sendEmbedMessage(options)
  }
}