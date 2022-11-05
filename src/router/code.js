const Router = require('koa-router')
const codeRouter = new Router({ prefix: '/code' })
const { sendCode } = require('../controller/code.controller')
codeRouter.get('/:email/:code', sendCode)

module.exports = codeRouter
