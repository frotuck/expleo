const utils = require('./writer');
const DEFAULT_ERROR_CODE = 500;

class ServiceError extends Error {
	code;
	message;
	constructor(code, message) {
		super();
		Object.setPrototypeOf(this, ServiceError.prototype);
		this.code = code;
		this.message = message;
	}

	getCode() {
		return this.code;
	}

	getMessage() {
		return this.message;
	}
}

module.exports = {
	ServiceError,
	errorHandlerMiddleware: (err, req, res, next) => {
		if (res.headersSent) {
			return next(err);
		}

		if (!(err instanceof ServiceError)) {
			return utils.writeJson(
				res,
				utils.respondWithCode(err?.code || err?.status || DEFAULT_ERROR_CODE, {
					message: err?.message,
					stack: err?.stack,
				})
			);
		}

		const errorPayload = JSON.stringify({
			errorCode:
				typeof err.getCode === 'function' ? err.getCode() : DEFAULT_ERROR_CODE,
			cause:
				typeof err.getMessage === 'function'
					? err.getMessage()
					: 'System error',
		});

		return utils.writeJson(
			res,
			utils.respondWithCode(err?.code || DEFAULT_ERROR_CODE, errorPayload)
		);
	},
};
