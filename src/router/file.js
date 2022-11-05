const Router = require('koa-router')
const router = new Router({ prefix: '/file' })
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	articleFileHandler
} = require('../middleware/file.middleware')
router.post('/article/img', verifyToken, articleFileHandler)

module.exports = router