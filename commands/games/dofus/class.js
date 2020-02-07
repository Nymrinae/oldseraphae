import Command from 'core/Command'

module.exports = class ClassCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'class',
      description: 'Display class in Dofus',
      usage: 'class',
      category: 'games',
      subCategory: 'dofus',
      aliases: [''],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    const className = args[0]
    const res = await this.client.apis.dofus.getClassByName(className)
    const { description, femaleImg, maleImg, name, spells, url } = res

    const options = {
      title: `${name}`,
      description,
      url,
      thumbnail: { url: Math.random() > 0.5 ? maleImg : femaleImg },
      footer: { text: `Dofus - Class Search` },
      fields: [{
        name: `**Skills**`,
        value: spells.map(s => `${s.name} / ${s.variant}`).join('\n')
      }]
    }

    super.sendEmbedMessage(options)
  }
}