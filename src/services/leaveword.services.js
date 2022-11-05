const conn = require('../config/database')
const {
	APP_HOST,
	APP_PORT
} = require('../config/index')
class Leaveword {
	async send(user_id, content) {
		const statement = `INSERT INTO leaveword (content, user_id) VALUES (?, ?)`
		const [res] = await conn.execute(statement, [content, user_id])
		return res
	}
	async list() {
		const statement = `
			SELECT
				users.id, users.name, lw.content, CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar
			FROM leaveword lw
			LEFT JOIN users ON users.id = lw.user_id
			LEFT JOIN avatar ON avatar.user_id = lw.user_id
		`
		const [res] = await conn.execute(statement)
		return res
	}
}
module.exports = new Leaveword()