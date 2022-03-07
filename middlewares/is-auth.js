const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        const error = new Error('Not authenticated');
        error.httpStatusCode = 401;
        return next(error);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.httpStatusCode = 401;
        return next(error);
    }

    req.userId = decodedToken.userId;
    next();
}