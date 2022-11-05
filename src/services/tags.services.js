const connection = require('../config/database')
class Tags {
	async add(name) {
		// 先检查是否有同名标签
		const [res1] = await connection.execute(`SELECT * FROM tags WHERE name = ?`, [name])
		if (res1.length) {
			// 存在同名标签，不能重复添加
			return 0
		}
		const statement = `INSERT INTO tags (name) VALUES (?)`
		const [res2] = await connection.execute(statement, [name])
		return res2
	}
	async list() {
		const statement = `SELECT * FROM tags`
		const [res] = await connection.execute(statement)
		return res
	}
	async del(name) {
		const statement = `DELETE FROM tags WHERE name = ?`
		const [res] = await connection.execute(statement, [name])
		return res
	}
}
module.exports = new Tags()