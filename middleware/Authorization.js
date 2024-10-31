const jwt = require('jsonwebtoken')
const AdminAuthentication = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, 'Authorization')
            if (decoded.accounttype === "admin" || decoded.accounttype === "conductor" || decoded.accounttype === "driver" ) {
                next()
            } else {
                res.json({ status: "error", message: "Admin Permission's Not Found In Your Account" })
            }
        } catch (error) {
            res.json({ status: "error", message: "Token Expired. Please Login Again" })
        }
    } else {
        res.json({ status: "error", message: "No Token Found in Headers." })
    }
}


module.exports = {
    AdminAuthentication
}