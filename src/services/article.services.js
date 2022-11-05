const connection = require('../config/database')
const {
	APP_PORT,
	APP_HOST
} = require('../config/index')
class Article {
	async addImg(filename, uploadid, mimetype) {
		// 首先保存图片数据到数据库
		let statement = `INSERT INTO files (url, mimetype) VALUES (?, ?)`
		const [res1] = await connection.execute(statement, [filename, mimetype])
		if (!res1.affectedRows) {
			// 图片上传失败
			return false
		}
		// 图片上传成功，然后保存图片和文章的关系
		const id = res1.insertId
		statement = `INSERT INTO `
	}
	async update(content, title, desc, uploadId, articleId) {
		let statement = ''
		if (!articleId) {
			// 没有传入文章id，表示这是一篇新帖子
			statement = `INSERT INTO article (content, title, description, upload_id) VALUES (?, ?, ?, ?)`
			const [res] = await connection.execute(statement, [content, title, desc, uploadId])
			return res
		}
		// 传入了文章id，表示这是一篇已存在的帖子，进行了再编辑
		statement = `UPDATE article SET content = ?, title = ?, description = ?, upload_id = ? WHERE id = ?`
		const [res] = await connection.execute(statement, [content, title, desc, uploadId, articleId])
		return res
	}
	async tags(articleId, tags) {
		const errorTags = []
		// 删除之前对应帖子的标签，不管存不存在
		let statement = ''
		statement = `DELETE FROM article_tag WHERE article_id = ?`
		await connection.execute(statement, [articleId])
		// 然后插入一个个新的标签
		for (let item of tags) {
			// 先查询此标签的id
			statement = `SELECT * FROM tags WHERE name = ?`
			const [res] = await connection.execute(statement, [item])
			const id = res[0].id
			// 插入数据
			statement = `INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?)`
			const [res2] = await connection.execute(statement, [articleId, id])
			if (!res2.affectedRows) {
				// 插入不成功
				errorTags.push(item)
			}
		}
		// 完成插入
		return errorTags
	}
	async cate(articleId, cate) {
		// 删除与此帖子相关的分类数据，后续重新插入新的
		let statement = ''
		statement = 'DELETE FROM article_cate WHERE article_id = ?'
		await connection.execute(statement, [articleId])
		// 查询该分类的id
		statement = `SELECT * FROM cate WHERE name = ?`
		const [res] = await connection.execute(statement, [cate])
		const id = res[0].id
		// 更新帖子的分类信息
		statement = `INSERT INTO article_cate (article_id, cate_id) VALUES (?, ?)`
		const [res2] = await connection.execute(statement, [articleId, id])
		return res2
	}
	async surface(articleId, filename, mimetype) {
		let statement = `SELECT * FROM article_photo WHERE article_id = ?`
		const [res] = await connection.execute(statement, [articleId])
		if (res.length) {
			// 这个帖子已有封面图
			const id = res[0].file_id
			// 根据fileId去更新新的封面图
			statement = `UPDATE files SET url = ?, mimetype = ?, surface = 1 WHERE id = ?`
			const [res2] = await connection.execute(statement, [filename, mimetype, id])
			return res2
		}
		// 这个帖子之前不存在封面图
		statement = `INSERT INTO files (url, mimetype, surface) VALUES (?, ?, ?)`
		const [res2] = await connection.execute(statement, [filename, mimetype, 1])
		if (res2.affectedRows) {
			// 插入成功，保存一个article_photo的file_id
			statement = `INSERT INTO article_photo (file_id, article_id) VALUES (?, ?)`
			const [res3] = await connection.execute(statement, [res2.insertId, articleId])
			return res3
		}
		return {
			affectedRows: 0
		}
	}
	async getImg(filename) {
		const statement = `SELECT * FROM files WHERE url = ?`
		const [res] = await connection.execute(statement, [filename])
		return res[0]
	}
	async img(filename, mimetype) {
		const statement = `INSERT INTO files (url, mimetype) VALUES (?, ?)`
		const [res] = await connection.execute(statement, [filename, mimetype])
		return res
	}
	async list() {
		const statement = `
			SELECT
				article.id articleId, article.title, article.content, article.description, article.updateAt,
				(
					SELECT
						JSON_ARRAYAGG(tags.name)
					FROM article_tag at
					LEFT JOIN tags ON at.tag_id = tags.id
					WHERE at.article_id = article.id
				) tags,
				(
					SELECT
						cate.name
					FROM article_cate ac
					LEFT JOIN cate ON cate.id = ac.cate_id
					WHERE ac.article_id = article.id
				) cateName,
				(
					SELECT
						concat('http://${APP_HOST}:${APP_PORT}/article/imgs/', files.url)
					FROM article_photo ap
					LEFT JOIN files ON files.id = ap.file_id
					WHERE ap.article_id = article.id AND surface = 1
				) surface,
				JSON_OBJECT('id', admin.id, 'name', admin.name, 'avatar', CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name)) uploader
			FROM article
			LEFT JOIN admin ON admin.id = article.upload_id
			LEFT JOIN avatar on avatar.user_id = admin.id
			GROUP BY article.id
			ORDER BY DATE(updateAt) DESC
		`
		const [res] = await connection.execute(statement)
		return res
	}
	async total() {
		// 获取文章总数
		const statement = `SELECT COUNT(*) total FROM article`
		const [res] = await connection.execute(statement)
		return res[0]
	}
	async classification() {
		const statement = `
			SELECT
				JSON_ARRAYAGG(JSON_OBJECT('id', article.id, 'title', article.title, 'desc', article.description, 'updateAt', article.updateAt)) list,
				(SELECT CONCAT(Year(updateAt), '-', Month(updateAt)) FROM article GROUP BY Month(updateAt)) updateAt
			FROM article
			GROUP BY Month(updateAt)
		`
		const [res2] = await connection.execute(`SELECT COUNT(DISTINCT(Month(updateAt))) total FROM article`)
		const [res] = await connection.execute(statement)
		return { res, res2 }
	}
	async detail(id) {
		const statement = `
			SELECT
				article.title, article.updateAt, article.description, article.content, admin.nickname,
				CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar,
				cate.name cateName,
				JSON_ARRAYAGG(tags.name) tags
			FROM article
			LEFT JOIN admin ON admin.id = article.upload_id
			LEFT JOIN avatar ON avatar.user_id = admin.id
			LEFT JOIN article_cate ON article_cate.article_id = article.id
			LEFT JOIN cate ON cate.id = article_cate.cate_id
			LEFT JOIN article_tag at ON at.article_id = article.id
			LEFT JOIN tags ON tags.id = at.tag_id
			WHERE article.id = ?
		`
		const [res] = await connection.execute(statement, [id])
		return res
	}
	async getArticleByCate(cate_id) {
		let statement = `
			SELECT
				JSON_ARRAYAGG(
					JSON_OBJECT(
						'id', article.id, 'title', article.title, 'desc',article.description,
						'createAt', article.createAt, 'surface', CONCAT('http://${APP_HOST}:${APP_PORT}/article/imgs/', files.url)
					)
				) list
			FROM article_cate ac
			LEFT JOIN article ON article.id = ac.article_id
			LEFT JOIN article_photo ap ON ap.article_id = article.id
			LEFT JOIN files ON ap.file_id = files.id
			WHERE ac.cate_id = ? AND files.surface = 1
		`
		const [res] = await connection.execute(statement, [cate_id])
		if (res[0].list) {
			for (let i = 0; i < res[0].list.length; i++) {
				res[0].list[i].tags = []
				const articleId = res[0].list[i].id
				statement = `
					SELECT
						JSON_ARRAYAGG(tags.name) tags
					FROM article_tag at
					LEFT JOIN tags ON tags.id = at.tag_id
					WHERE at.article_id = ?
				`
				const [res2] = await connection.execute(statement, [articleId])
				res[0].list[i].tags.push(...res2[0].tags)
			}
		}
		return res
	}
	async getArticleByTag(tagId) {
		let statement = `
			SELECT 
				article.id, article.title, article.createAt,
				CONCAT('http://${APP_HOST}:${APP_PORT}/article/imgs/', files.url) surface,
				cate.name cateName,
				(
				SELECT
					JSON_ARRAYAGG(tags.name)
				FROM article_tag at
				LEFT JOIN tags ON tags.id = at.tag_id
				WHERE at.article_id = article.id
				) tags
			FROM article
			LEFT JOIN article_tag at ON at.article_id = article.id
			LEFT JOIN article_cate ac ON ac.article_id = article.id
			LEFT JOIN cate ON ac.cate_id = cate.id
			LEFT JOIN article_photo ap ON ap.article_id = article.id
			LEFT JOIN files ON ap.file_id = files.id
			WHERE at.tag_id = ? AND files.surface = 1
			GROUP BY article.id
		`
		const [res] = await connection.execute(statement, [tagId])
		return res
	}
	async getArticleTotalByTag(tagId) {
		const statement = `SELECT COUNT(*) total FROM article_tag WHERE tag_id = ?`
		const [res] = await connection.execute(statement, [tagId])
		return res
	}
	async queryArticle(data) {
		const statement = `
			SELECT
				id, title, description, createAt
			FROM article
			WHERE title LIKE '%${data}%'
			GROUP BY id
		`
		const [res] = await connection.execute(statement)
		return res
	}
}

module.exports = new Article()