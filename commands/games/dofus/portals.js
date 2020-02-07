import Command from 'core/Command'
import cheerio from 'cheerio'
import { getRandomNumber } from 'helpers/functions'

module.exports = class PortalsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'portals',
      description: 'Display the position of portals if they\'re not hidden',
      usage: 'portals',
      category: 'games',
      subCategory: 'dofus',
      aliases: ['dp'],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async () => {
    const res = await this.client.apis.dofus.getPortals()
    const $ = cheerio.load(res)
    const classImages = []
    const options = {
      title: `Portals`,
      footer: { text: 'Dofus - Portals' },
      fields: []
    }

    $('button.copybtn.btn').each((i, elem) => {
      let pos = elem.attribs['data-clipboard-text']
      //pos = pos.replace('Position inconnue', 'Positioninconnue')

      let portal = elem.attribs['data-clipboard-text'].split(' - ')
      const className = portal[0].split(' ')[0]

      classImages.push(`https://dofus-portals.fr/images/portals/${className}.png`)
      options.fields.push({
        name: `**${className}**`,
        value: [
          `**Position:** ${portal[0].split(' ')[1]}`,
          `**Nb. Utilisations:** ${portal[1].split(' ')[0]}`,
        ].join('\n')
      })
    })

    options.thumbnail = {
      url: classImages[getRandomNumber(classImages.length)]
    }

    super.sendEmbedMessage(options)
  }
}