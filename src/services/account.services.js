const connection = require('../config/database')
const {
	APP_PORT,
	APP_HOST
} = require('../config/index')
// 验证管理者登录的账号密码
const matchAccount = async (name, password) => {
	const statement = `SELECT
			adm.id as id, adm.name as name, adm.signature as signature, ava.name as avatar
		FROM admin adm 
		LEFT JOIN avatar ava 
		ON adm.id = ava.user_id`
	const [res] = await connection.execute(statement, [name, password])
	return res
}
// 验证注册管理者时是否已存在同名账号
const checkAdminName = async (name) => {
	const statement = `SELECT * FROM admin WHERE name=?`
	const [res] = await connection.execute(statement, [name])
	return res
}
// 新增管理员
const addNewAdmin = async (name, password, signature) => {
	const statement = `INSERT INTO admin (name, password, signature) VALUES (?, ?, ?)`
	const [res] = await connection.execute(statement, [name, password, signature ? signature : '无'])
	return res
}
const updateSignature = async (signature, id) => {
	const statement = `UPDATE admin SET signature = ? WHERE id = ?`
	const [res] = await connection.execute(statement, [signature, id])
	return res
}
const updateAvatar = async (name, mimetype, id) => {
	// 检查是否有存在的头像信息记录，有就在对于信息上更新，否则直接插入
	let statement = `SELECT mimetype, name FROM avatar WHERE user_id = ?`
	const [res1] = await connection.execute(statement, [id])
	if (res1.length) {
		// 已存在头像信息，更新
		statement = `UPDATE avatar SET name = ?,mimetype = ? WHERE user_id = ?`
		const [res2] = await connection.execute(statement, [name, mimetype, id])
		return res2
	}
	// // 之前不存在头像信息，第一次更新，直接插入
	statement = `INSERT INTO avatar (name, mimetype, user_id) VALUES (?, ?, ?)`
	const [res3] = await connection.execute(statement, [name, mimetype, id])
	return res3
}
const queryAvatar = async (filename) => {
	const statement = `SELECT mimetype FROM avatar WHERE name = ?`
	const [res] = await connection.execute(statement, [filename])
	return res[0]
}
const info = async () => {
	const statement = `
		SELECT
			admin.id, admin.name, admin.signature, admin.nickname,
			CONCAT('http://${APP_HOST}:${APP_PORT}/admin/avatar/', avatar.name) avatar,
			(SELECT COUNT(*) total FROM article) articleTotal,
			(SELECT COUNT(*) total FROM tags) tagsTotal,
			(SELECT COUNT(*) total FROM cate) cateTotal
		FROM admin
		LEFT JOIN avatar ON avatar.user_id = admin.id
		WHERE admin.id = ?
	`
	const [res] = await connection.execute(statement, [7])
	return res[0]
}
module.exports = {
	matchAccount,
	checkAdminName,
	addNewAdmin,
	updateSignature,
	updateAvatar,
	queryAvatar,
	getInfo: info
}