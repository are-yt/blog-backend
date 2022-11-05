const Router = require('koa-router')
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	add
} = require('../controller/links.controller')
const linksRouter = new Router({ prefix: '/links' })
linksRouter.post('/add', verifyToken, add)
module.exports = linksRouter