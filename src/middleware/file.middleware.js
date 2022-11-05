const multer = require('koa-multer')
const path = require('path')
const avatar_file = multer({
	dest: path.resolve(__dirname, '../files/avatar')
})
const avatarHandler = avatar_file.single('avatar')

const articleFile = multer({
	dest: path.resolve(__dirname, '../files/article')
})
const articleFileHandler = articleFile.single('articleImg')

exports.avatarHandler = avatarHandler
exports.articleFileHandler = articleFileHandler
