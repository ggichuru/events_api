const jwt = require('jsonwebtoken')
require('dotenv').config()

function checkAuth(req, res, next) {
    try {
        // get token from headers and split it to access
        const token = req.headers.authorization.split(" ")[1]

        // Verify token and key as defined in login 
        const decodedToken = jwt.verify(token, process.env.JWTKEY)

        req.userData = decodedToken

        //pass execution to next available middleware
        next();
    } catch (e) {
        res.status(401).json({
            'message': 'Invalid or expired token',
            'error': e
        })
    }
}

module.exports = {
    checkAuth:checkAuth
}