const router = new require('koa-router')({ prefix: '/basic' })

const { updateBasic, getBasic } = require('../controller/basic.controller')
const { verifyToken } = require('../middleware/auth.middleware')
router.post('/update', verifyToken,updateBasic)
router.get('/', getBasic)

module.exports = router