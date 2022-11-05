const axios = require('axios')
const $shici = axios.create({
	baseURL: 'https://v2.jinrishici.com',
	timeout: 10000
})
const $code = axios.create({
	baseURL: 'http://api.guaqb.cn',
	timeout: 10000
})
exports.$shici = $shici
exports.$code = $code