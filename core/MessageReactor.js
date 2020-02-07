
export default class MessageReactor {
  constructor(client, message) {
    this.client = client
    this.message = message
  }

  addReactionToMessage = async (msg, reaction) => {
    await msg.react(reaction)
  }

  removeReactionToMessage = reaction => {
    reaction.remove(this.message.author.id)
  }
} 