const conn = require('../config/database')
const {
	APP_PORT,
	APP_HOST
} = require('../config/index')
class Comment {
	async linkReply(parent_id, reply_id, user_id, content) {
		// 保存评论内容等信息
		const statement = `INSERT INTO comment_link (user_id, content) VALUES (?, ?)`
		const [res] = await conn.execute(statement, [user_id, content])
		// 保存回复关系记录
		const [res2] = await conn.execute(`INSERT INTO comment_link_reply (comment_id, reply_id, parent_id) VALUES (?, ?, ?)`, [res.insertId, reply_id || null, parent_id || null])
		return res
	}
	async articleReply(parent_id, reply_id, article_id, user_id, content) {
		// 保存评论内容等信息
		let statement = `INSERT INTO comment_article (article_id, user_id, content) VALUES (?, ?, ?)`
		const [res] = await conn.execute(statement, [article_id, user_id, content])
		// 保存回复关系
		statement = `INSERT INTO comment_article_reply (comment_id, parent_id, reply_id) VALUES (?, ?, ?)`
		await conn.execute(statement, [res.insertId, parent_id || null, reply_id || null])
		return res
	}
	async linkList() {
		const statement = `
			SELECT
				cl.id commentId, cl.createAt, cl.content, CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar,
				users.name, users.email
			FROM comment_link cl
			LEFT JOIN avatar ON avatar.user_id = cl.user_id
			LEFT JOIN users ON users.id = cl.user_id
			LEFT JOIN comment_link_reply clr ON clr.comment_id = cl.id
			WHERE clr.parent_id is NULL
			ORDER BY cl.createAt DESC
		`
		const [res] = await conn.execute(statement)
		// 然后查询各个文章的所有回复
		for (let i = 0; i < res.length; i++) {
			const comment_id = res[i].commentId
			const statement = `
				SELECT
					cl.id commentId, cl.createAt, cl.content, CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar,
					users.name, users.email, clr.reply_id
				FROM comment_link_reply clr
				LEFT JOIN comment_link cl ON cl.id = clr.comment_id
				LEFT JOIN avatar ON avatar.user_id = cl.user_id
				LEFT JOIN users ON users.id = cl.user_id
				WHERE clr.parent_id = ?
			`
			const [res2] = await conn.execute(statement, [comment_id])
			res[i].children = []
			if (res2.length) {
				res[i].children.push(...res2)
			}
		} 
		return res
	}
	async getArticleCommentListById(id) {
		let statement = `
			SELECT
				ca.content, ca.createAt, ca.id commentId,
				users.name, users.email,
				CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar
			FROM comment_article ca
			LEFT JOIN users ON users.id = ca.user_id
			LEFT JOIN avatar ON avatar.user_id = ca.user_id
			LEFT JOIN comment_article_reply car ON ca.id = car.comment_id
			WHERE ca.article_id = ? AND car.parent_id IS NULL
			ORDER BY ca.createAt DESC
		`
		const [res] = await conn.execute(statement, [id])
		// 根据每个顶级评论的id去查找该评论的所有子评论
		for (let i = 0; i < res.length; i++) {
			res[i].children = []
			const commentId = res[i].commentId
			statement = `
				SELECT
					car.reply_id, ca.content, ca.createAt, ca.id commentId,
					users.name, users.email,
					CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar
				FROM comment_article_reply car
				LEFT JOIN comment_article ca ON ca.id = car.comment_id
				LEFT JOIN users ON users.id = ca.user_id
				LEFT JOIN avatar ON avatar.user_id = ca.user_id
				WHERE car.parent_id = ?
			`
			const [res2] = await conn.execute(statement, [commentId])
			if (res2.length) {
				res[i].children.push(...res2)
			}
		}
		return res
	}
	async getLinkCommentTotal() {
		const [res] = await conn.execute(`SELECT COUNT(*) total FROM comment_link_reply WHERE parent_id IS NULL`)
		return res
	}
	async getArticleCommentTotal(id) {
		const statement = `
			SELECT COUNT(*) total
			FROM comment_article_reply car
			LEFT JOIN comment_article ca ON car.comment_id = ca.id
			WHERE ca.article_id = ? AND car.parent_id IS NULL
		`
		const [res] = await conn.execute(statement, [id])
		return res
	}
}
module.exports = new Comment()