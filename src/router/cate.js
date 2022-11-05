const Router = require('koa-router')
const cateRouter = new Router({ prefix: '/cate' })
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	add,
	list,
	del
} = require('../controller/cate.controller')
cateRouter.post('/:name', verifyToken, add)
cateRouter.get('/list', list)
cateRouter.post('/del/:name', verifyToken, del)
module.exports = cateRouter