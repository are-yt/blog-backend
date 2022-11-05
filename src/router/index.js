const { readdir } = require('fs')
const { resolve } = require('path')

module.exports = (app) => {
	readdir(resolve(__dirname), (err, files) => {
		if (err) {
			return console.log('读取路由文件错误' + err.message)
		}
		for (let file of files) {
			if (file !== 'index.js') {
				const router = require(resolve(__dirname, file))
				app.use(router.routes())
			}
		}
	})
}