import Command from 'core/Command'
import moment from 'moment'

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      description: 'Display user information',
      usage: 'userinfo',
      category: 'info',
      aliases: ['ui'],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = message => {
    const member = message.mentions.members.first() || message.member
    const { displayName, joinedAt } = member
    const roles = member.roles.filter(r => r.id !== message.guild.id).map(x => x).join(' ') || 'No roles'
    const { createdAt, discriminator, displayAvatarURL, id, presence, tag } = member.user

    const options = {
      author: { name: tag, icon_url: displayAvatarURL },
      thumbnail: { url: displayAvatarURL },
      footer: { text: 'Information - User Info' },
      fields: [
        {
          name: '**Member Information**',
          value: `**× Nickname:** ${displayName} \n \
                 **× Joined at:** ${moment(joinedAt).format('LL')}`
        },
        {
          name: '**User Information**',
          value: `** × ID**: ${id} \n \
                 ** × Discriminator:** ${discriminator} \n \
                 ** × Status:** ${presence.status} \n \
                 ** × Created At:** ${moment(createdAt).format('LL')}`
        },
        { name: '**Currently playing**', value: presence.game.name },
        { name: '**Roles**', value: roles }
      ]
    }

    super.sendEmbedMessage(options)
  }
}