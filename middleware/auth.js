const jwt = require('jsonwebtoken')

const User = require('../models/user')

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string') {
        return res.status(401).send({
            "message": "Not authorized"
        })
    }

    const [bearer, token] = authHeader.split(" ", 2)

    if (bearer !== "Bearer") {
        return res.status(401).send({
            "message": "Not authorized"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            if (
                err.name === 'JsonWebTokenError' ||
                err.name === 'TokenExpiredError'
            ) {
                return res.status(401).send({
                    "message": "Not authorized"
                })
            }
            console.log(err)
            return res.status(500).send({ message: "Internal Server Error" })
        }

        try {
            const user = await User.findById(decode.id)

            if (user.token !== token) {
                return res.status(401).send({
                    "message": "Not authorized"
                })
            }

            req.user = { id: user.id }

            next()
        } catch (err) {
            next(err)
        }
    })
}

module.exports = auth