module.exports = class ReadyEvent {
  constructor(client) {
    this.client = client
  }

  run = message => {
    console.log('Bot is ready !')
    this.client.user.setActivity(`${this.client.config.defaultPrefix}help`)
  }
}
