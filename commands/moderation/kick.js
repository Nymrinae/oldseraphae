import Command from 'core/Command'

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'Kick  someone from a server',
      usage: 'kick',
      category: 'moderation',
      aliases: [],
      permLevel: 5,
      permission: 'READ_MESSAGES'
    })
  }

  run = (message, args) => {
    const member = message.guild.member(message.mentions.users.first())
    const reason = args.slice(1).join(' ') || ''

    if (!member)
      super.sendMessage('You must mention a member.')

    member.kick(reason).then(member => {
      super.sendMessage(`${member.displayName} has been kicked LULW`)
    }).catch(e => {
      super.sendMessage("I'm missing perms to do that...")
    });
  }
}