const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')
const app = new Koa()
const handleError = require('./utils/handleError')

const { APP_PORT, APP_HOST } = require('./config/index')
// 处理跨域
app.use(cors())

// 处理请求参数
app.use(bodyparser())

// 统一处理应用抛出的错误
app.on('error', handleError)

// 一次性注册所有路由
require('./router')(app)

app.listen(APP_PORT, APP_HOST, () => {
	console.log(`koa服务器已开启,端口号:${APP_PORT}`)
})