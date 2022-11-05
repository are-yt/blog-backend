const { $shici } = require('../request/index')
const { SHICI_ERROR } = require('../constants/error.types')
let token = ''

const getToken = (ctx) => {
	return new Promise(resolve => {
		$shici.request({
			url: '/token',
			method: 'GET'
		})
			.then(res => {
				token = res.data.data
				resolve()
			})
			.catch(err => ctx.app.emit('error', new Error(SHICI_ERROR), ctx))
	})
}

const getContent = (ctx) => {
	return new Promise(resolve => {
		$shici.request({
			url: '/sentence',
			method: 'GET',
			headers: {
				'X-User-Token': token
			}
		})
			.then(res => resolve(res))
			.catch(err => ctx.app.emit('error', new Error(SHICI_ERROR), ctx))
	})
}

class Shici {
	async getShici(ctx) {
		token = token || ctx.request.body.shicitoken
		if (!token) {
			// 先请求诗词token
			await getToken(ctx)
			const res = await getContent(ctx)
			ctx.body = res.data.data.content
		} else {
			// 传入了诗词token，直接请求诗词内容
			const res = await getContent(ctx)
			ctx.body = res.data.data.content
		}
	}
}

module.exports = new Shici()