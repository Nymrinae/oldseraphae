module.exports = class MessageEvent {
  constructor(client) {
    this.client = client
  }

  run = message => {
    const prefix = this.client.config.defaultPrefix

    if (message.author.bot ||
        message.channel.type == 'dm' ||
        !message.content.startsWith(prefix))
      return
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command))

    if (!cmd) return

    const permLevelUser = this.client.checkPermissions(message)
    const permLevelCmd = this.client.perms.find(l => l.level === cmd.conf.permLevel).level

    if (permLevelUser >= permLevelCmd) {
      this.client.logger.init(message)
      cmd.setMessage(message)
      cmd.run(message, args)
    } else {
      message.channel.send('You don\'t have enough permissions to run this command !')
    }
  }
}
