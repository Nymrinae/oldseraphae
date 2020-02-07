import Command from 'core/Command'

module.exports = class AlmanaxCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'almanax',
      description: 'Check almanax',
      usage: 'almanax [nextDays]',
      category: 'games',
      subCategory: 'dofus',
      aliases: [],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    const day = args[0]
    const data = await this.client.apis.dofus.getAlmanax(day)

    const item = data.quest.split(' ')
    item.shift()
    const itemInfos = await this.client.apis.dofus.getResourceByName(item.join(' '))

    const questName = data.bonus.split(':')[1].split(' ').slice(0, 4)
    questName.shift()

    data.bonus = data.bonus.split('.')[0]

    const options = {
      title: `Almanax ${data.date}`,  
      thumbnail: { url: itemInfos.length ? itemInfos[0].imgUrl : '' },
      footer: { text: 'Dofus - Almanax' },
      fields: [
        { name: '**Bonus**', value: data.bonus },
        { name: `**Quest: ${questName.join(' ')}**`, value: data.quest }
      ]
    }
    super.sendEmbedMessage(options)
  }
}