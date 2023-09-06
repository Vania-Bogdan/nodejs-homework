const User = require("../../models/user")

async function verify(req, res, next) {
    const token = req.params.verificationToken
    try {
        const user = await User.findOne({ verificationToken: token }).exec()

        if (user === null) {
            return res.status(404).send({ message: 'User not found' })
        }

        await User.findByIdAndUpdate(user.id, {
            verify: true,
            verificationToken: null,
        })

        return res.status(200).send({ message: 'Verification successful' })
    } catch (err) {
        next(err)
    }

}

module.exports = verify