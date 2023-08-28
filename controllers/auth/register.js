const User = require('../../models/user');

const bcrypt = require('bcrypt')

const gravatar = require('gravatar');

const Jimp = require('jimp');

const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    avatarURL: Joi.string(),
})

async function register(req, res, next) {
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
        const existingUser = await User.findOne({ email }).exec()
        if (existingUser !== null) {
            return res.status(409).json({ message: `Email in use` })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const avatar = gravatar.url({ email })

        Jimp.read(avatar, (err, avatar) => {
            if (err) throw err;
            avatar.resize(250, 250) // resize
        });

        const newUser = await User.create({ email, password: passwordHash, avatarURL: avatar })
        return res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = register