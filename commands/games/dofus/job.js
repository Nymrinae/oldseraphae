import Command from 'core/Command'

module.exports = class JobCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'job',
      description: 'Display job in Dofus',
      usage: 'job',
      category: 'games',
      subCategory: 'dofus',
      aliases: [''],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    const jobName = args[0]
    const res = await this.client.apis.dofus.getJobByName(jobName)
    const { description, harvests, imgUrl, name, url } = res

    const options = {
      title: `${name}`,
      description,
      url,
      thumbnail: { url: imgUrl },
      footer: { text: `Dofus - Job Search` },
      fields: [{
        name: `**Recipes**`,
        value: harvests.map(j => `**×** ${j.name} (Lv.${j.level}) `).join('\n')
      }]
    }

    super.sendEmbedMessage(options)
  }
}