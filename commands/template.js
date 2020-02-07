import Command from 'core/Command'

module.exports = class TemplateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'NAME_HERE',
      description: 'DESC_HERE',
      usage: 'USAGE_HERE',
      category: 'CATEGORY_HERE',
      subCategory: 'SUBCATEGORY_HERE',
      aliases: [''],
      permLevel: 0,
      permission: 'PERMISSIONS_HERE'
    })
  }

  run = async () => {
    return
  }
}