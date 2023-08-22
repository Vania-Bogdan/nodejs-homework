const Contact = require('../../models/contact');

const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean()
})

async function create(req, res, next) {
    try {
        const response = contactSchema.validate(req.body)
        if (typeof response.error !== 'undefined') {
            if (response.error.message.includes('not allowed to be empty') || response.error.message.includes('is required')) {
                const invalidValue = response.error.message.split(' ')[0].replaceAll('"', '')
                return res.status(400).json({ message: `missing required ${invalidValue} field` })
            } else {
                return res.status(400).json({ message: `${response.error.message}` })
            }
        } else {
            const userId = req.user.id

            const contact = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                favorite: req.body.favorite,
                owner: userId
            }
            const createdContact = await Contact.create(contact)
            return res.status(201).send(createdContact)
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = create