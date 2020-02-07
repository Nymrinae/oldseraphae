import Command from 'core/Command'
import { upperCaseFirstLetter } from 'helpers/functions'

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Display help',
      usage: 'help',
      category: 'bot',
      aliases: [],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = (message, args) => {
    const cmd = args[0]
    const commands = this.client.commands.filter(c => c.conf.permLevel <= this.client.level)

    const options = {
      title: '',
      footer: { text: 'Information - Help' },
      description: '',
      fields: []
    }
    
    if (cmd) {
      const { help, conf } = commands.find(c => c.help.name === cmd || c.conf.aliases.includes(cmd))

      options.title = `**${help.name}**`
      options.description = help.description
      options.fields.push(
        {
          name: '**Help**',
          value: `** Category:** ${help.category} \n \
                  ** Usage: ** ${this.client.config.defaultPrefix}${help.usage}`,
          inline: true
        },
        {
          name: '**Configuration**',
          value: `** Aliases:** ${conf.aliases.length > 0 ? conf.aliases.join(', ') : 'No aliases.'} \n \
                  ** Permission Level: ** ${conf.permLevel}
                  ** Permissions:** ${conf.permission}`,
          inline: true
      })
    } else {
      const categories = Array.from(new Set(commands.map(c => c.help.category)))

      options.title = '**help**'
      options.description = `Use \`${this.client.config.defaultPrefix}help [commandName]\` for more information`

      categories.forEach(category => {
        if (category.startsWith('m')) return
        const categorizedCommands = commands.filter(c => c.help.category === category)
                                            .map(c => `${c.help.name}`)

        options.fields.push({
          name:  upperCaseFirstLetter(category),
          value: categorizedCommands.join(', ')
        })
      })
    }

    super.sendEmbedMessage(options)
  }
}