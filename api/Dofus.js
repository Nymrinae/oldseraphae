import axios from 'axios'

const API_BASE_URL = 'https://fr.dofus.dofapi.fr'
const PORTALS_BASE_URL = 'https://dofus-portals.fr/portails/66'
const ALMANAX_BASE_URL = 'https://cdn.jsdelivr.net/npm/dofus-data@2.2.1/almanax-data.json'

module.exports = class DofusAPI {
  getConsumableByName = consumableName => {
    return this.request(`/consumables?filter[where][name]=${consumableName}`)
  }

  getClassByName = className => {
    return this.request(`/classes?filter[where][name]=${className}`)
  }

  getEquipementByName = equipementName => {
    return this.request(`/equipments?filter[where][name]=${equipementName}`)
  }

  getEquipmentSetByID = setId => {
    return this.request(`/sets?filter[where][ankamaId]=${setId}`)
  }

  getIdolByName = idolName => {
    return this.request(`/idols?filter[where][name]=${idolName}`)
  }

  getJobByName = jobName => {
    return this.request(`/professions?filter[where][name]=${jobName}`)
  }

  getMonsterByName = monsterName => {
    return this.request(`/monsters?filter[where][name]=${monsterName}`)
  }

  getMountByName = mountName => {
    return this.request(`/mounts?filter[where][name]=${mountName}`)
  }

  getPetByName = petName => {
    return this.request(`/pets?filter[where][name]=${petName}`)
  }

  getResourceByName = resourceName => {
    return this.request(`/resources?filter[where][name]=${resourceName}`)
  }

  getWeaponByName = weaponName => {
    return this.request(`/weapons?filter[where][name]=${weaponName}`)
  }

  getAlmanax = async (day = 0) => {
    const res = await this.request(ALMANAX_BASE_URL)
    let date = new Date()
  
    day > 0 ? date.setDate(date.getDate() + parseInt(day)) : null
    date = date.toISOString().substring(5, 10)

    res[date].date = date
  
    return res[date]
  }

  getPortals = async () => {
    return this.request(PORTALS_BASE_URL)
  }

  request = async endpoint => {
    const isDofusApi = endpoint.startsWith('/')
    const url = isDofusApi ? API_BASE_URL + endpoint : endpoint
    const res = await axios.get(url)

    return isDofusApi ? res.data[0] : res.data
  }
}