const password2md5 = require('../utils/password2md5')
const { addNewAdmin, updateSignature, updateAvatar, queryAvatar, getInfo } = require('../services/account.services')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/index')
const fs = require('fs')
const { resolve } = require('path')
const jimp = require('jimp')
const {
	APP_HOST,
	APP_PORT
} = require('../config/index')
class Account {
	// 管理员注册
	async register(ctx) {
		const name = ctx.request.body.name
		const password = password2md5(ctx.request.body.password)
		const signature = ctx.request.body.signature
		const res = await addNewAdmin(name, password, signature)
		if (res.affectedRows) {
			// 新增管理员成功
			ctx.body = {
				data: {},
				errorCode: 0,
				message: '新增管理员成功'
			}
		} else {
			// 新增管理员失败
			ctx.body = {
				data: {},
				errorCode: 1,
				message: '新增管理员失败'
			}
		}
	}
	// 管理员登录
	login(ctx) {
		// 经过中间件的校验，这里颁发token，以及返回一些登录者的账号信息
		let { name, avatar, signature, id } = ctx.account
		avatar = `http://${APP_HOST}:${APP_PORT}/admin/avatar/${avatar}`
		const token = jwt.sign({ name, id }, PRIVATE_KEY, {
			expiresIn: 60 * 60 * 24,
			algorithm: 'RS256'
		})
		ctx.body = {
			name,
			avatar,
			signature,
			id,
			token,
			errorCode: 0
		}
	}
	// 更新管理员信息
	async update(ctx) {
		const { signature, id } = ctx.request.params
		const res = await updateSignature(signature, id)
		if (res.affectedRows) {
			// 修改成功
			return ctx.body = {
				data: {},
				errorCode: 0,
				message: '修改管理员签名成功'
			}
		}
		ctx.body = {
			data: {},
			errorCode: 1,
			message: '修改管理员签名失败'
		}
	}
	async updateAvatar(ctx) {
		const { filename, mimetype } = ctx.req.file
		const { id } = ctx.request.params
		// 读取图片，进行大小处理
		const save_addr = resolve(__dirname, '../files', 'avatar', filename)
		jimp.read(save_addr).then(image => {
			// 把原图删了
			fs.unlinkSync(resolve(__dirname, '../files', 'avatar', filename))
			// 保存被裁剪过的缩略图
			image.resize(120, jimp.AUTO).write(save_addr)
		})
		// 更新头像信息
		const res = await updateAvatar(filename, mimetype, id)
		if (res.affectedRows) {
			// 更新成功
			return ctx.body = {
				data: {
					url: `http://${APP_HOST}:${APP_PORT}/admin/avatar/` + filename
				},
				errorCode: 0,
				message: '头像更新成功'
			}
		}
		更新失败
		ctx.body = {
			data: {},
			errorCode: 1,
			message: '头像更新失败'
		}
	}
	async getAvatar(ctx) {
		const { filename } = ctx.request.params
		// 查询头像文件类型
		const { mimetype } = await queryAvatar(filename)
		ctx.response.set('content-type', mimetype)
		ctx.body = fs.createReadStream(resolve(__dirname, '../files', 'avatar', filename))
	}
	async info(ctx) {
		const res = await getInfo()
		ctx.body = res
	}
}

module.exports = new Account()