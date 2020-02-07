import Command from 'core/Command'
import ytdl from 'ytdl-core'

module.exports = class YoutubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      description: 'Listen some music!',
      usage: 'youtube ',
      category: 'music',
      aliases: ['music', 'yt'],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    const [type, link] = args
    const queue = new Map()
    const serverQueue = queue.get(message.guild.id)

    switch (type) {
      case 'play':
        const voiceChannel = message.member.voiceChannel

        if (!voiceChannel)
          return super.sendMessage('You need to be in a voice channel to play some music !')

        const perms = voiceChannel.permissionsFor(message.client.user)

        if (!perms.has('CONNECT') || !perms.has('SPEAK'))
          return super.sendMessage('I need the permissions to join and speak in your voice channel')
        
        const songInfo = await ytdl.getInfo(link)
        const song = {
          title: songInfo.title,
          url: songInfo.video_url
        }

        if (!serverQueue) {
          const songQueue = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          }

          queue.set(message.guild.id, songQueue)
          this.queue = queue
          songQueue.songs.push(song)

          try {
            const connection = await voiceChannel.join()

            songQueue.connection = connection
            this.play(message.guild, songQueue.songs[0])
          } catch (err) {
            throw err
          }
        } else {
          serverQueue.songs.push(song)

          return super.sendMessage(`${song.title} has been added to queue!`)
        }

    }
  }
  
  play = (guild, song) => {
    const serverQueue = this.queue.get(guild.id)

    if (!song) {
      serverQueue.voiceChannel.leave()
      queue.delete(guild.id)

      return
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))

    dispatcher.on('error', (err) => {
      throw err
    })

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
  }
}