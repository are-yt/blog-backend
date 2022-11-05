const crypto = require('crypto')

const password2md5 = (password) => {
	return crypto.createHash('md5').update(password).digest('hex')
}

module.exports = password2md5