const Router = require('koa-router')
const shiciRouter = new Router({ prefix: '/shici' })
const { getShici } = require('../controller/shici')
shiciRouter.get('/', getShici)
module.exports = shiciRouter