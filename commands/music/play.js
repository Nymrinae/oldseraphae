import Command from 'core/Command'
import ytdl from 'ytdl-core'

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      description: 'Play a song',
      usage: 'play',
      category: 'music',
      aliases: [],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    if (!message.member.voiceChannel)
      return super.sendMessage('Please connect to a voice channel first.')
    if (message.guild.me.voiceChannel)
      return super.sendMessage('I am already in a voice channel!')
    if (!args[0])
      return super.sendMessage('Provide a link please')

    try {
      const validate = ytdl.validateURL(args[0])
      const info = await ytdl.getInfo(args[0])
      const connection = await message.member.voiceChannel.join()
      const dispatcher = await connection.playStream(ytdl(args[0], { filter: 'audioonly'}))

      super.sendMessage(`Currently playing ${info.title}`)
    } catch (e) {
      super.sendMessage('An error happened. Please retry')
      throw e
    }
  }
}