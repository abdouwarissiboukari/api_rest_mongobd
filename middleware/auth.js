const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken =jwt.verify(token, 'RANDOM_TOP_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();        
    } catch {
        res.status(401).json({ message: 'Invalid authorization token!'});
    }
};