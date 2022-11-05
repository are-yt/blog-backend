const mysql = require('mysql2')

const {
	MYSQL_PORT,
	MYSQL_HOST,
	MYSQL_USER,
	MYSQL_PASSWORD,
	MYSQL_DATABASE
} = require('./index.js')

const connection = mysql.createPool({
	port: MYSQL_PORT,
	host: MYSQL_HOST,
	user: MYSQL_USER,
	password: MYSQL_PASSWORD,
	database: MYSQL_DATABASE,
	dateStrings: true
})

connection.getConnection((err, conn) => {
	if (err) {
		return console.log(`${MYSQL_DATABASE}数据库链接失败` + err.message)
	}
	conn.connect(err => {
		if (err) {
			return console.log(`${MYSQL_DATABASE}数据库链接失败` + err.message)
		}
		console.log(`${MYSQL_DATABASE}数据库链接成功`)
	})
})

module.exports = connection.promise()