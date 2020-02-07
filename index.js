require = require('esm')(module /*, options */)
require('app-module-path').addPath(`${__dirname}`)

module.exports = require('./app')