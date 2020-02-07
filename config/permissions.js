import { botConfig } from './config'

const roles = {
  "modRole": "aModRole",
  "adminRole": "aAdminRole"
}

export const permLevels = [
  {
    level: 0,
    name: 'User',
    check: () => true
  },
  {
    level: 1,
    name: 'Moderator',
    check: message => {
      const modRole = message.guild.roles.find(r => r.name.toLowerCase() === roles.modRole.toLowerCase())

      return modRole && message.member.roles.has(modRole.id)
    }
  },
  {
    level: 3,
    name: 'Server Owner',
    check: message => message.author.id === message.guild.owner.user.id
  },
  {
    level: 5,
    name: 'Admin',
    check: message => {
      const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === roles.adminRole.toLowerCase())

      return adminRole && message.member.roles.has(adminRole.id)
    }
  },
  {
    level: 10,
    name: 'Bot Owner',
    check: message => message.author.id === botConfig.ownerID
  }
]