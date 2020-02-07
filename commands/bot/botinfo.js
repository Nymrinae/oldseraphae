import Command from 'core/Command'
import { version } from 'discord.js'
require('moment-duration-format')

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      description: 'Display Bot Information',
      usage: 'botinfo',
      category: 'bot',
      aliases: ['bi'],
      permLevel: 10,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    const uptime = 0 //moment.duration()
    const { username, displayAvatarURL } = this.client.user

    const options = {
      author: { name: username, icon_url: displayAvatarURL },
      description: 'Hello, I am **Seraphae**. Multi-purpose bot which can acts as a wiki for your games. LoL, Dofus... and more! Stay tuned!',
      thumbnail: { url: displayAvatarURL },
      footer: { text: 'Information - Bot Info' },
      fields: [
        { 
          name: '**Stats**', 
          value: `** × Uptime:** ${uptime}\n \
                  ** × Serving:** ${this.client.guilds.size} guilds\n \
                  ** × NodeJS version**: ${process.version}\n \
                  ** × DiscordJS version**: ${version}\n`
        },
        {
          name: '**Useful links**', value: 'No links yet.'
        }
      ]
    }

    super.sendEmbedMessage(options)
  }
}