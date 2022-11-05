const handleError = (err, status, ctx) => {
	ctx.status = status
	ctx.body = {
		data: {},
		message: err.message,
		errorCode: 1
	}
}

module.exports = handleError