const conn = require('../config/database')
const {
	APP_PORT,
	APP_HOST
}	= require('../config/index')
class Moment {
	async reply(content, user_id) {
		const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?)`
		const [res] = await conn.execute(statement, [content, user_id])
		return res
	}
	async list() {
		const statement = `
			SELECT
				m.id momentId, m.content, m.createAt, admin.nickname, CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar
			FROM moment m
			LEFT JOIN admin ON admin.id = m.user_id
			LEFT JOIN avatar ON avatar.user_id = admin.id
		`
		const [res] = await conn.execute(statement)
		for (let i = 0; i < res.length; i++) {
			// 根据momentId获取对应说说的点赞数和评论数
			const { momentId } = res[i]
			const [likecount] = await conn.execute(`SELECT COUNT(*) total FROM moment_like WHERE moment_id = ?`, [momentId])
			res[i].likecount = likecount[0].total
			const [replycount] = await conn.execute(`SELECT COUNT(*) total FROM comment_moment WHERE moment_id = ?`, [momentId])
			res[i].replycount = replycount[0].total
		}
		return res
	}
	async total() {
		const [res] = await conn.execute(`SELECT COUNT(*) total FROM moment`)
		return res
	}
	async like(userId, momentId) {
		let statement = `SELECT * FROM moment_like WHERE user_id = ? AND moment_id = ?`
		const [res] = await conn.execute(statement, [userId, momentId])
		if (res.length) {
			// 当前用户对该帖子点过赞了，则取消对该帖子的点赞
			statement = `DELETE FROM moment_like WHERE user_id = ? AND moment_id = ?`
			await conn.execute(statement, [userId, momentId])
			return 0
		}
		// 当前用户对该帖子没有点赞
		statement = `INSERT INTO moment_like (user_id, moment_id) VALUES (?, ?)`
		await conn.execute(statement, [userId, momentId])
		return 1
	}
	async userLikeList(userId) {
		const list = []
		const statement = `SELECT moment_id FROM moment_like WHERE user_id = ?`
		const [res] = await conn.execute(statement, [userId])
		res.forEach(item => {
			list.push(item.moment_id)
		})
		return list
	}
	async momentDetail(momentId) {
		let statement = `
			SELECT
				m.content, m.createAt, admin.nickname, CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar,
				(
				SELECT COUNT(*) total
				FROM moment_like
				WHERE moment_id = ?
				) likecount,
				(
				SELECT COUNT(*) total
				FROM comment_moment
				WHERE moment_id = ?
				) replycount
			FROM moment m
			LEFT JOIN admin ON admin.id = m.user_id
			LEFT JOIN avatar ON avatar.user_id = admin.id
			WHERE m.id = ?
		`
		const [res] = await conn.execute(statement, [momentId, momentId, momentId])
		return res
	}
	async momentComment(momentId) {
		let statement = `
			SELECT
				cm.id commentId, cm.content, cm.createAt, users.name, users.email,
				CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar
			FROM comment_moment cm
			LEFT JOIN comment_moment_reply cmr ON cm.id = cmr.comment_id
			LEFT JOIN users ON users.id = cm.user_id
			LEFT JOIN avatar ON avatar.user_id = cm.user_id
			WHERE cmr.parent_id IS NULL AND cm.moment_id = ?
		` 
		const [res] = await conn.execute(statement, [momentId])
		for (let i = 0; i < res.length; i++) {
			const commentId = res[i].commentId
			res[i].children = []
			statement = `
				SELECT
					cm.id commentId, cm.content, cm.createAt, users.name, users.email, cmr.reply_id,
					CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar
				FROM comment_moment_reply cmr
				LEFT JOIN comment_moment cm ON cmr.comment_id = cm.id
				LEFT JOIN users ON users.id = cm.user_id
				LEFT JOIN avatar ON avatar.user_id = cm.user_id
				WHERE cmr.parent_id = ?
			`
			const [res2] = await conn.execute(statement, [commentId])
			if (res2.length) {
				res[i].children.push(...res2)
			}
		}
		return res
	}
	async momentCommentTotal(momentId) {
		const statement = `SELECT COUNT(*) total FROM comment_moment_reply cmr LEFT JOIN comment_moment cm ON cmr.comment_id = cm.id WHERE cmr.parent_id IS NULL AND cm.moment_id = ?`
		const [res] = await conn.execute(statement, [momentId]) 
		return res
	}
	async replyComment(user_id, parent_id, reply_id, moment_id, content) {
		let statement = `INSERT INTO comment_moment (content, user_id, moment_id) VALUES (?, ?, ?)`
		const [res] = await conn.execute(statement, [content, user_id, moment_id])
		statement = `INSERT INTO comment_moment_reply (comment_id, parent_id, reply_id) VALUES (?, ?, ?)`
		const [res2] = await conn.execute(statement, [res.insertId, parent_id || null, reply_id || null])
		return res
	}
}

module.exports = new Moment()