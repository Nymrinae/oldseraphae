import { Attachment } from 'discord.js'

const ICONS_URL = {
  'dofus': 'https://www.psykozgaming.com/wp-content/uploads/2019/05/dofus_icon.png',
  'leagueoflegends': 'http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png',
  'information': 'https://cdn3.iconfinder.com/data/icons/bold-blue-glyphs-free-samples/32/Info_Circle_Symbol_Information_Letter-512.png'
}

export default class Command {
  constructor(client, options) {
    this.client = client

    this.help = {
      name: options.name || '',
      description: options.description || 'No description',
      usage: options.usage || '',
      category: options.category || ''
    }

    this.conf = {
      permLevel: options.permLevel || 0,
      permission: options.permission || 'SEND_MESSAGES',
      aliases: options.aliases || []
    }
  }

  setMessage(message) {
    this.message = message
  }

  sendMessage(message) {
    this.message.channel.send(message)
  }

  async sendEmbedMessage(embed) {
    const moduleName = embed.footer.text.split(' - ')[0].toLowerCase().split(' ').join('')

    embed.timestamp = new Date()
    embed.footer.icon_url = ICONS_URL[moduleName] //'http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png' //`attachment://${moduleName}.png`

    const msg = await this.message.channel.send({ embed })

    return msg
  }
}