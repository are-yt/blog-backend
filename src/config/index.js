const dotenv = require('dotenv')
const { resolve } = require('path')
const { readFileSync } = require('fs')

// 调用dotenv.config()将会自动读取根目录下的.env文件内容装填到process.env这个全局对象中
dotenv.config()

module.exports = {
	APP_PORT,
	APP_HOST,
	MYSQL_PORT,
	MYSQL_USER,
	MYSQL_PASSWORD,
	MYSQL_DATABASE,
	MYSQL_HOST
} = process.env

const PUBLIC_KEY = readFileSync(resolve(__dirname, '../keys', 'public.key'))
const PRIVATE_KEY = readFileSync(resolve(__dirname, '../keys', 'private.key'))

module.exports.PUBLIC_KEY = PUBLIC_KEY
module.exports.PRIVATE_KEY = PRIVATE_KEY