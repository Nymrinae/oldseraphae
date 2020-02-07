import fs from 'fs'
import path from 'path'
// import i18n from 'i18n'
import { Client, Collection } from 'discord.js'
import { botConfig } from 'config/config.js'
import { permLevels } from 'config/permissions'

export default class Seraphae extends Client {
  constructor() {
    super()

    this.commands = new Collection()
    this.aliases = new Collection()
    this.apis = {}
    this.config = botConfig
    this.perms = permLevels
    this.logger = null

    this.level = 0
  }

  setLogger = logger => this.logger = logger

  login = token => {
    super.login(token)

    return this
  }

  loadCommands = () => {
    fs.readdir('./commands/', (err, files) => {
      let walkSync = (dir, filelist) => {
        files = fs.readdirSync(dir)
        filelist = filelist || []
        files.forEach(file => {
          if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist)
          }
          else
            filelist.push(dir + '/' + file) 
        })
    
        return filelist
      }
    
      let commands = walkSync('./commands')
      if (commands.length <= 0)
        return

      commands.forEach(f => {
        const cmd = new (require(`.${f}`))(this)

        this.commands.set(cmd.help.name, cmd)
        cmd.conf.aliases.forEach(alias => this.aliases.set(alias, cmd.help.name))
      })
    })

    return this
  }

  loadEvents = () => {
    fs.readdir('./events/', (err, files) => {
      if (err) 
        console.log(err)
    
      files.forEach(file => {
        const event = new (require(`../events/${file}`))(this)
        const eventName = file.split(".")[0]
    
        super.on(eventName, (...args) => event.run(...args))
      })
    })

    return this
  }

  loadAPIs = () => {
    fs.readdir('./api/', (err, files) => {
      if (err)
        console.log(err)
      
        files.forEach(file => {
          const api = new (require(`../api/${file}`))(this)
          const apiName = file.split('.')[0]
          this.apis[apiName.toLowerCase()] =  api
        })
    })

    return this
  }

  /* configurei18n() {
    i18n.configure({
      locales: ['en', 'fr'],
      defaultLocale: 'fr',
      directory: __dirname + '/locales'
    })
  } */

  checkPermissions = message => {
    let permLvl = 0

    for (const perm of this.perms) {
      if (perm.check(message))
        permLvl = perm.level
    }
    this.level = permLvl

    return permLvl
  }
}