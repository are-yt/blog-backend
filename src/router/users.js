const Router = require('koa-router')
const {
	register,
	login,
	resetPassword,
	updateName
} = require('../controller/users.controller')
const {
	isExistsUser,
	checkMatchUser,
	resetPasswordCheck
} = require('../middleware/users.middleware')
const {
	verifyToken
} = require('../middleware/auth.middleware')
const usersRouter = new Router({ prefix: '/user' })
usersRouter.post('/register', isExistsUser, register)
usersRouter.post('/login', checkMatchUser, login)
usersRouter.post('/password/reset', resetPasswordCheck, resetPassword)
usersRouter.post('/update/name/:id/:name', verifyToken, updateName)
module.exports = usersRouter