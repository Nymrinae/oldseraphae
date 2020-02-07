import Command from 'core/Command'
import { upperCaseFirstLetter } from 'helpers/functions'

const TYPE = {
  CONSUMABLE: 'consumable',
  EQUIPEMENT: 'equipment',
  IDOL: 'idol',
  MONSTER: 'monster',
  MOUNT: 'mount',
  RESOURCE: 'resource',
  PET: 'pet',
  WEAPON: 'weapon'
}

module.exports = class DofusCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dofus',
      description: 'Dofus related commands',
      usage: 'dofus [itemType] [item]',
      category: 'games',
      subCategory: 'dofus',
      aliases: [],
      permLevel: 0,
      permission: 'READ_MESSAGES'
    })
  }

  run = async (message, args) => {
    const entityType = args[0]
    const item = args.slice(1).join(' ')
    let res = null

    switch(entityType) { 
      case TYPE.CONSUMABLE:
        res = await this.client.apis.dofus.getConsumableByName(item)
        break
      case TYPE.EQUIPEMENT:
        res = await this.client.apis.dofus.getEquipementByName(item)
        break
      case TYPE.IDOL:
        res = await this.client.apis.dofus.getIdolByName(item)
        break
      case TYPE.MONSTER:
        res = await this.client.apis.dofus.getMonsterByName(item)
        break
      case TYPE.MOUNT:
        res = await this.client.apis.dofus.getMountByName(item)
        break
      case TYPE.RESOURCE:
        res = await this.client.apis.dofus.getResourceByName(item)
        break
      case TYPE.PET:
        res = await this.client.apis.dofus.getPetByName(item)
        break
      case TYPE.WEAPON:
        res = await this.client.apis.dofus.getWeaponByName(item)
        break
      default:
        return super.sendMessage(`Type required: ${Object.values(TYPE).join(', ')}`)
    }
    const options = await this.generateOptions(res, entityType)

    super.sendEmbedMessage(options)
  }

  generateOptions = async (res, entityType) => {
    const { ankamaId, name, description, url, imgUrl } = res
    const stats = res.statistics ? this.parseRes(res.statistics) : null
    const recipes = res.recipe ? this.parseRes(res.recipe) : null

    let options = {
      title: `#${ankamaId} - ${name}`,
      description,
      url,
      thumbnail: { url: imgUrl },
      footer: { text: `Dofus - ${upperCaseFirstLetter(entityType)} Search` },
      fields: []
    }

    const equipable = [TYPE.EQUIPEMENT, TYPE.WEAPON].includes(entityType)
    const isMonster = [TYPE.MONSTER].includes(entityType)
    options = this.addLevelAndType(res, options)

    if (equipable) {
      const set = await this.client.apis.dofus.getEquipmentSetByID(res.setId)

      options = this.addSet(options, set)
    }
    
    options = this.addStats(options, stats, equipable)
    options = isMonster ? this.addMonsterStats(res, options)
                        : this.addRecipes(options, recipes)

    return options
  }

  addLevelAndType = (res, options, isMonster) => {
    const level = {
      name: '**Level**',
      value: res.level,
      inline: true
    }

    const type = {
      name: '**Type**',
      value: res.type,
      inline: true
    }

    if (isMonster)
      options.fields.push(level)
    options.fields.push(type)

    return options
  }

  addStats = (options, stats, equipable) => {
    options.fields.push({
      name: '**Stats**',
      value: stats.map(s => `**${s.min} ${s.max ? ' à ' + s.max : ''}** ${s.name}`).join('\n'),
      inline: !equipable
    })

    return options
  }

  addRecipes = (options, recipes) => {
    options.fields.push({
      name: '**Craftable with**',
      value: recipes ? recipes.map(r => `**${r.quantity}** [${r.name}](${r.url})`).join(' | ') : 'None.'
    })

    return options
  }

  addSet = (options, set) => {
    options.fields.push({
      name: '**Set**',
      value: set ? set.name : 'No associated set.',
      inline: true
    })

    return options
  }

  addMonsterStats = (res, options) => {
    const resistances = this.parseRes(res.resistances)
    const drops = res.drops.map(e => {
      return {
        id: e.ankamaId,
        name: e.name,
        url: e.url,
        rate: e.dropPercent.min
      }
    })

    options.fields.push({
      name: '**Resistances**',
      value: resistances.map(r => `**×** ${r.name}: **${r.min}**`).join('\n'),
      inline: true
    },
    {
      name: '**Areas**',
      value: res.areas.join(' | ')
    },
    {
      name: '**Drops**', 
      value: drops.map(d => `${d.id ? d.id  + ' -' : ''} [${d.name}](${d.url}) (${d.rate}%)`).join('\n')
    })

    return options
  }


  parseRes = object => {
    const items = []

    object.map(e => items.push({
      name: Object.keys(e)[0],
      ...Object.values(e)[0]
    }))

    return items
  }
}