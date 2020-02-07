import axios from 'axios'

const lang = 'en_US'
const API_BASE_URL = 'https://ddragon.leagueoflegends.com'

module.exports = class LeagueofLegendsAPI {
  getPatch = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/versions.json`)

    return res.data[0]
  }

  getChampionInfo = async championName => {
    const res = await this.request(`/data/${lang}/champion/${championName}.json`)
    const championInfo = Object.values(res.data)[0]
    const { key, id, lore, tags, stats, partype, passive, spells, title, allytips, enemytips, skins } = championInfo
    const champion = {
      id: key,
      name: id,
      desc: lore,
      tags,
      partype,
      stats,
      skills: { passive, spells },
      title,
      tips: { ally: allytips, enemy: enemytips },
      skins
    }

    return champion
  }

  getChampionIcon = championName => {
    return this.getLinkFrom(`/img/champion/${championName}.png`)
  }

  getChampionPassiveIcon = passivName => {
    return this.getLinkFrom(`/img/passive/${passivName}`)
  }

  getChampionSkillIcon = skillName => {
    return this.getLinkFrom(`/img/spell/${skillName}`)
  }

  getLinkFrom = async link => {
    const patch = await this.getPatch()

    return `${API_BASE_URL}/cdn/${patch}${link}`
  }

  request = async endpoint => {
    const patch = await this.getPatch()
    const res = await axios.get(`${API_BASE_URL}/cdn/${patch}${endpoint}`)

    return res.data
  }
}