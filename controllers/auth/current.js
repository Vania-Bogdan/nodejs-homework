const User = require("../../models/user")

async function current(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (typeof authHeader !== 'string') {
            return res.status(401).send({
                "message": "Not authorized"
            })
        }

        const [bearer, token] = authHeader.split(" ", 2)

        const user = await User.findOne({ token }).exec()

        console.log(user)
        return res.status(200).json({ email: user.email, subscription: user.subscription })
    } catch (err) {
        next(err)
    }
}

module.exports = current


//findOne()