const Router = require('koa-router')
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	send,
	list
} = require('../controller/leaveword.controller')
const leavewordRouter = new Router({ prefix: '/leaveword' })
leavewordRouter.post('/send', verifyToken, send)
leavewordRouter.get('/list', list)
module.exports = leavewordRouter