const jwt = require('jsonwebtoken')
const RegistrationAuthentication = (req, res, next) => {
    const token = req.headers.token
    if (token) {
        try {
            const decoded = jwt.verify(token, 'Registration')
            next()
        } catch (error) {
            res.json({ status: "error", message: "Registration Token Expired. Please Register Again" })
        }
    } else {
        res.json({ status: "error", message: "No Token Found in Headers." })
    }
}


module.exports = {
    RegistrationAuthentication
}