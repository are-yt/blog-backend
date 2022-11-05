const conn = require('../config/database')
class Links {
	async add(url, name, desc) {
		const statement = `INSERT INTO friend_links (name, description, url) VALUES (?, ?, ?)`
		const [res] = await conn.execute(statement, [name, desc, url])
		return res
	}
}
module.exports = new Links()