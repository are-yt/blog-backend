const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
const { $code } = require('../request/index')
const send = (email, code) => {
	return new Promise(resolve => {
		$code
			.request({
			url: '/music/yx/qq.php?user=2821458718@qq.com&password=bmmbredqjpyydcga&email=' + email + '&bt=来自cy-blog的验证码&nr=验证码:' + code,
			method: 'GET'
		})
			.then(res => resolve(res))
	})
}
const sendCode = async (ctx) => {
	const { code, email } = ctx.request.params
	if (!code || !email) {
		return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 400, ctx)
	}
	const res = await send(email, code)
	ctx.body = res.data
}

exports.sendCode = sendCode