const {
	register: registerUser,
	getAvatarUrl,
	resetPassword: resetUserPassword,
	updateName: updateNameById
} = require('../services/users.services')
const {
	APP_PORT,
	APP_HOST
} = require('../config/index')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/index')
class Users {
	async register(ctx) {
		const { name, email, password } = ctx.user
		// 用户不存在，开始注册该用户，密码已在中间件中加密
		const res = await registerUser(name, email, password)
		if (res.affectedRows) {
			// 注册成功
			return ctx.body = {
				errorCode: 0
			}
		}
		// 注册失败
		ctx.body = {
			errorCode: 1,
			message: '注册失败'
		}
	}
	async login(ctx) {
		const { id, name, email } = ctx.user
		const token = jwt.sign({ id, name }, PRIVATE_KEY, {
			algorithm: 'RS256',
			expiresIn: 24 * 60 * 10
		})
		// 获取用户头像
		const res = await getAvatarUrl(id)
		ctx.body = {
			id,
			name,
			token,
			email,
			avatar: res.length ? `http://${APP_HOST}:${APP_PORT}/user/avatar/${res[0].name}` : '',
			errorCode: 0
		}
	}
	async resetPassword(ctx) {
		const { email, password } = ctx.user
		const res = await resetUserPassword(email, password)
		if (res.affectedRows) {
			// 更新成功
			return ctx.body = {
				errorCode: 0
			}
		}
		// 更新失败
		ctx.body = {
			errorCode: 1,
			message: '重置密码失败'
		}
	}
	async updateName(ctx) {
		const { id, name } = ctx.request.params
		const res = await updateNameById(id, name)
		if (res.affectedRows) {
			return ctx.body = {
				errorCode: 0
			}
		}
		ctx.body = {
			errorCode: 1,
			message: '修改昵称失败,可能是昵称过长'
		}
	}
}
module.exports = new Users()