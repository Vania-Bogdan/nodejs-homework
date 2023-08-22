const User = require('../../models/user');

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

require("dotenv").config()

const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

async function login(req, res, next) {
    const { email, password } = req.body
    try {
        const response = userSchema.validate(req.body)
        if (typeof response.error !== 'undefined') {
            if (response.error.message.includes('not allowed to be empty') || response.error.message.includes('is required')) {
                const invalidValue = response.error.message.split(' ')[0].replaceAll('"', '')
                return res.status(400).json({ message: `missing required ${invalidValue} field` })
            } else {
                return res.status(400).json({ message: `${response.error.message}` })
            }
        }

        const user = await User.findOne({ email }).exec()

        if (user === null) {
            return res.status(401).send({ "message": "Email or password is wrong" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch === false) {
            return res.status(401).send({ "message": "Email or password is wrong" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
            { expiresIn: 3600 })

        await User.findByIdAndUpdate(user._id, { token })

        return res.status(200).json({
            token: token,
            user: {
                email: email,
                subscription: "starter"
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = login