//знайти user по email за допомогою findOne, перевірити verify = false:
//- якщо так то надіслати email
//- якщо ні : вже верифіковано

const User = require("../../models/user")

const sendEmail = require('./nodemailer')

const crypto = require('node:crypto')

const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
})


async function repeatverify(req, res, next) {
    const email = req.body.email
    try {
        const response = userSchema.validate(req.body)
        if (typeof response.error !== 'undefined') {
            if (response.error.message.includes('not allowed to be empty') || response.error.message.includes('is required')) {
                return res.status(400).json({ message: 'missing required field email' })
            } else {
                return res.status(400).json({ message: `${response.error.message}` })
            }
        }
        const user = await User.findOne({ email }).exec()
        if (user === null) {
            return res.status(404).send({ message: 'User not found' })
        }
        console.log(user.verify)
        if (user.verify !== false) {
            return res.status(400).send({ message: 'Verification has already been passed' })
        }

        const token = crypto.randomUUID()

        await User.findByIdAndUpdate(user.id, {
            verificationToken: token
        })

        sendEmail({
            to: email,
            subject: 'Welcome on board',
            html: `
            <p>To confirm your email please click on the link below</p>
            <a href="http://localhost:3000/users/verify/${token}">Click me</a>
            `
        })

        return res.status(200).send({ message: 'Verification email sent' })
    } catch (err) {
        next(err)
    }
}

module.exports = repeatverify