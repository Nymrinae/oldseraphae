import Seraphae from './core/Client'
import Logger from './core/Logger'

const client = new Seraphae()
const logger = new Logger(client)

client.setLogger(logger)
client.loadCommands()
client.loadEvents()
client.loadAPIs()
// client.configureI18n()

client.login(client.config.token)