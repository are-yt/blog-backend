const connection = require('../config/database')
class Cate {
	async add(name) {
		// 先检查是否有同名分类
		const [res1] = await connection.execute('SELECT * FROM cate WHERE name = ?', [name])
		if (res1.length) {
			// 有同名分类
			return 0
		}
		const statement = `INSERT INTO cate (name) VALUES (?)`
		const [res] = await connection.execute(statement, [name])
		return res
	}
	async list() {
		const list = []
		const statement = `
			SELECT
				cate.name, cate.id
			FROM cate
		`
		const [res] = await connection.execute(statement)
		for (let i = 0; i < res.length; i++) {
			const statement = `SELECT COUNT(*) total FROM article_cate WHERE cate_id = ?`
			const [res2] = await connection.execute(statement, [res[i].id])
			list.push({
				id: res[i].id,
				name: res[i].name,
				total: res2[0].total
			})
		}
		return list
	}
	async del(name) {
		const statement = `DELETE FROM cate WHERE name = ?`
		const [res] = await connection.execute(statement, [name])
		return res
	}
}
module.exports = new Cate()