import Command from 'core/Command'

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      description: 'Display server information',
      usage: 'serverinfo',
      category: 'info',
      aliases: ['si'],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = message => {
    const regions = {
      "brazil": ":flag_br: Brazil",
      "europe": ":flag_eu: Europe",
      "hongkong": ":flag_hk: Hong Kong",
      "india": "flag_in Inde",
      "japan": ":flag_jp: Japan",
      "russia": ":flag_ru: Russia",
      "singapore": ":flag_sg: Singapore",
      "southafrica": ":flag_za:  South Africa",
      "sydney": ":flag_au: Sydney",
      "us-central": ":flag_us: U.S. Central",
      "us-east": ":flag_us: U.S. East",
      "us-south": ":flag_us: U.S. South",
      "us-west": ":flag_us: U.S. West"
    }

    const { 
      id, name, iconURL, region, owner,
      members, roles, channels
    } = message.guild
    const bots = members.filter(m => m.user.bot).size

    const onlineEmoji = this.client.emojis.get('664894114197929995')
    const idleEmoji = this.client.emojis.get('664894610908119070')
    const dndEmoji = this.client.emojis.get('664894624497795092')
    const offlineEmoji = this.client.emojis.get('664893718133997569')
    
    const textChannels = channels.filter(c => c.type === 'text' || c.type === 'category').size
    const voiceChannels = channels.filter(c => c.type === 'voice').size

    const options = {
      author: { name: name, icon_url: iconURL },
      thumbnail: { url: iconURL },
      footer: { text: 'Information - Server Info' },
      fields: [{
        name: '**General**',
        value: `** × ID:** ${id}\n \
                ** × Owner:** ${owner.user.username}#${owner.user.discriminator}\n \
                ** × Region:** ${regions[region]}\n \
                ** × Created At:** ${message.channel.guild.createdAt.toUTCString().slice(4, 16)}`
      },
      {
        name: '**Members**',
        value: `${onlineEmoji} Online: **${members.filter(m => m.presence.status === 'online').size}**\n \
                ${idleEmoji} Idle: **${members.filter(m => m.presence.status === 'idle').size}**\n \
                ${dndEmoji} DND: **${members.filter(m => m.presence.status === 'dnd').size}**\n \
                ${offlineEmoji} Offline: **${members.filter(m => m.presence.status === 'offline').size}**`,
        inline: true
      },
      {
        name: '\u200b',
        value: `**Total Members:** ${members.size} \n \
                ** × Users:** ${members.size - bots} \n \
                ** × Bots:** ${bots}`,
        inline: true
      },
      {
        name: '**Server**',
        value: `**Roles**: ${roles.size}\n \
                **Channels** (${channels.size}) : \
                **${textChannels}** text channel${textChannels > 1 ? 's' : ''} and \
                **${voiceChannels}** voice channel${voiceChannels > 1 ? 's' : ''}`
      }]
    }

    super.sendEmbedMessage(options)
  }
}