const jwt = require('jsonwebtoken')
const UserAuthentication = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    if (token) {
        try {
            const decoded = jwt.verify(token, 'Authentication')            
            next()
        } catch (error) {
            res.json({ status: "error", message: "Authentication Token Expired. Please Login Again", redirect: "/user/login" })
        }
    } else {
        res.json({ status: "error", message: "No Token Found in Headers." })
    }
}


module.exports = {
    UserAuthentication
}