import { loggerConfig } from 'config/config'

export default class Logger {
  constructor(client) {
    this.client = client

    this.commandLogChannelID = null
    /* Member Update (nickname, joined, left) */
    this.memberLogChannelID = null
    /* Member Mod Update (warned, kicked, banned) */
    this.memberModLogChannelID = null
  }

  //getChannelById = (message, id) => message.guild.channel.get(id)
  
  getDefaultChannelByName = name => this.client.channels.find(ch => ch.name == name)

  init = async message => {
    this.message = message
    /* this.commandLogChannelID = this.getChannelById(this.commandLogChannelID) || this.getDefaultChannelByName('cmd-logs')
    this.memberLogChannelID = this.getChannelById(this.memberLogChannelID) || this.getDefaultChannelByName('memer-logs')
    this.memberModLogChannelID = this.getChannelById(this.memberModLogChannelID) || this.getDefaultChannelByName('membermod-logs') */
  }

  sendLogMessage = message => {
    this.message.channel.send(`LOG: ${message}`)
  }
}