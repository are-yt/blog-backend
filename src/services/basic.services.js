const connection = require('../config/database')
const update = async (title, notice) => {
	// 先删除之前的，基本信息保留一条即可
	await connection.execute(`DELETE FROM basic`)
	const statement = `INSERT INTO basic (title, notice) VALUES (?, ?)`
	const [res] = await connection.execute(statement, [title, notice])
	return res
}
const getInfo = async () => {
	const statement = `SELECT * FROM basic`
	const [res] = await connection.execute(statement)
	return res[0]
}
module.exports = {
	update,
	getInfo
}