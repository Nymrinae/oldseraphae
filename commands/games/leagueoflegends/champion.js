import Command from 'core/Command'
import MessageReactor from 'core/MessageReactor'

module.exports = class ChampionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'champion',
      description: 'Display infos about a champion',
      usage: 'champion',
      category: 'games',
      subCategory: 'lol',
      aliases: ['lol'],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  buildMainPage = async champion => {
    const championThumbnail = await this.client.apis.leagueoflegends.getChampionIcon(champion.name)

    const options = {
      title: `${champion.name}, ${champion.title}`,
      description: champion.desc,
      thumbnail: { url: championThumbnail },
      footer: { text: `League of Legends - ${champion.name}`},
      fields: [{
        name: '**ID**',
        value: champion.id,
        inline: true
      },
      {
        name: '**Type**',
        value: champion.tags.join(', '),
        inline: true
      },
      {
        name: '**Using**',
        value: champion.partype,
        inline: true
      },
      {
        name: `**Offensive/Misc Stats**`,
        value: [
          `**Attack Damage**: ${champion.stats.attackdamage} (${champion.stats.attackdamageperlevel}/level)`,
          `**Attack Speed**: ${champion.stats.attackspeed} (${champion.stats.attackspeedperlevel}/level)`,
          `**Range**: ${champion.stats.attackrange}`,
          `**Movement Speed**: ${champion.stats.movespeed}`
        ].join('\n'),
        inline: true
      },
      {
        name: `**Defensive Stats**`,
        value: [
          `**Health**: ${champion.stats.hp} (${champion.stats.hpperlevel}/level)`,
          `**Health Regen**: ${champion.stats.hpregen} (${champion.stats.hpregenperlevel}/level)`,
          `**Armor**: ${champion.stats.armor} (${champion.stats.armorperlevel}/level)`,
          `**Magic Resist**: ${champion.stats.spellblock} (${champion.stats.spellblockperlevel}/level)`
        ].join('\n'),
        inline: true
      }]
    }

    return options
  }

  buildTipsPage = champion => {
    const options = {
      title: `Tips playing with/against ${champion.name}`,
      footer: { 
        text: `League of Legends - ${champion.name}`,
        icon_url: 'http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png'
      },
      fields: [{
        name: `Tips when playing ${champion.name}`,
        value: champion.tips.ally.join('\n\n'),
        inline: true
      },
      {
        name: `Tips when playing against ${champion.name}`,
        value: champion.tips.enemy.join('\n\n'),
        inline: true
      }]
    }

    return options
  }

  buildPassivSkillPage = async champion => {
    const { description, image, name } = champion.skills.passive
    const passiveThumbnail = await this.client.apis.leagueoflegends.getChampionPassiveIcon(image.full)

    const options = {
      title: `[P] ${name}`,
      description: `${description}`,
      thumbnail: { url: passiveThumbnail },
      footer: { 
        text: `League of Legends - ${champion.name}`,
        icon_url: 'http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png'
      }
    }

    return options
  }

  buildSkillPage = async (champion, i) => {
    const possibleSkills = ['Q', 'W', 'E', 'R']
    const skill = champion.skills.spells[i]
    const skillThumbnail = await this.client.apis.leagueoflegends.getChampionSkillIcon(skill.image.full)
    const options = {
      title: `[${possibleSkills[i]}]`,
      description: skill.description,
      thumbnail: { url: skillThumbnail },
      footer: { 
        text: `League of Legends - ${champion.name}`,
        icon_url: 'http://2.bp.blogspot.com/-HqSOKIIV59A/U8WP4WFW28I/AAAAAAAAT5U/qTSiV9UgvUY/s1600/icon.png'
      },
      fields: [{
        name: `Cost`,
        value: skill.costBurn,
        inline: true
      },
      {
        name: `Cooldown`,
        value: skill.cooldownBurn,
        inline: true
      }]
    }

    return options
  }

  buildPages = async args => {
    let pages = []

    const championName = args.join('')
    const champion = await this.client.apis.leagueoflegends.getChampionInfo(championName)

    const mainPage = await this.buildMainPage(champion)
    const tipsPage = this.buildTipsPage(champion)
    const passivePage = await this.buildPassivSkillPage(champion)

    pages.push(mainPage, tipsPage, passivePage)
  
    for (let i = 0; i < 4; i++) {
      const skillPage = await this.buildSkillPage(champion, i)
  
      pages.push(skillPage)
    }

    return pages
  }

  run = async (message, args) => {
    let page = 1
    let pages = await this.buildPages(args)

    const msg = await super.sendEmbedMessage(pages[0])
    const msgReactor = new MessageReactor(this.client, message)

    await msgReactor.addReactionToMessage(msg, '⬅️')
    await msgReactor.addReactionToMessage(msg, '➡️')

    const backFilter = (r, user) => r.emoji.name === '⬅️' && user.id === message.author.id
    const forwardFilter = (r, user) => r.emoji.name === '➡️' && user.id === message.author.id

    const back = msg.createReactionCollector(backFilter, { time: 60000 })
    const forward = msg.createReactionCollector(forwardFilter, { time: 60000 })

    back.on('collect', reaction => {
      if (page == 1) return
      page--
      msg.edit({ embed: pages[page - 1] })

      msgReactor.removeReactionToMessage(reaction)
    })

    forward.on('collect', reaction => {
      if (page == pages.length) return
      page++

      msg.edit({ embed: pages[page - 1] })
      msgReactor.removeReactionToMessage(reaction)
    })
  }
}