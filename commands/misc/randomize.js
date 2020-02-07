import Command from 'core/Command'
import { shuffleArray } from 'helpers/functions'

module.exports = class RandomizeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'randomize',
      description: 'Randomize user inputs',
      usage: 'randomize',
      category: 'misc',
      aliases: [],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = (message, args) => {
    super.sendMessage(shuffleArray(args).join('\n'))
  }
}