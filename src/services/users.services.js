const conn = require('../config/database')
class Users {
	async register(name, email, password) {
		const statement = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
		const [res] = await conn.execute(statement, [name, email, password])
		return res
	}
	async isExistsUser(email) {
		const statement = `SELECT * FROM users WHERE email = ?`
		const [res] = await conn.execute(statement, [email])
		return res
	}
	async checkMathUser(email, password) {
		const statement = `SELECT * FROM users WHERE email = ? AND password = ?`
		const [res] = await conn.execute(statement, [email, password])
		return res
	}
	async getAvatarUrl(id) {
		const statement = `SELECT * FROM avatar WHERE user_id = ?`
		const [res] = await conn.execute(statement, [id])
		return res
	}
	async resetPasswordCheck(email) {
		const statement = `SELECT * FROM users WHERE email = ?`
		const [res] = await conn.execute(statement, [email])
		return res
	}
	async resetPassword(email, password) {
		const statement = `UPDATE users SET password = ? WHERE email = ?`
		const [res] = await conn.execute(statement, [password, email])
		return res
	}
	async updateName(id, name) {
		const statement = `UPDATE users SET name = ? WHERE id = ?`
		const [res] = await conn.execute(statement, [name, id])
		return res
	}
}
module.exports = new Users()