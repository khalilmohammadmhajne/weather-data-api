
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
        this.message = message;
    }
}

class BadRequestError extends CustomError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

class NotFoundError extends CustomError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

module.exports = {
    BadRequestError,
    NotFoundError,
    CustomError,
};
