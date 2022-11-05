const Router = require('koa-router')
const router = new Router({ prefix: '/admin' })

const { hasAdmin, checkAdmin } = require('../middleware/account.middleware')
const { register, login, update, updateAvatar, getAvatar, info } = require('../controller/account.controller')
const { verifyToken } = require('../middleware/auth.middleware')
const { avatarHandler } = require('../middleware/file.middleware')

router.post('/register', hasAdmin, register)
router.post('/login', checkAdmin, login)
router.post('/update/:id/:signature', verifyToken, update)
router.post('/avatar/:id', verifyToken, avatarHandler, updateAvatar)
router.get('/avatar/:filename', getAvatar)
router.get('/info', info)

module.exports = router