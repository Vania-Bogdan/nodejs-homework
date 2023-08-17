const Contact = require('../models/contact');

const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    favorite: Joi.boolean().required()
})

async function edit(req, res, next) {
    try {
        const response = contactSchema.validate(req.body)
        if (typeof response.error !== 'undefined') { // check on problem
            const missedValue = response.error.message.split(' ')[0].replaceAll('"', '') // clear missed value
            if (Object.keys(req.body).length === 0) { // check on empty body
                return res.status(400).json({ message: 'missing field favorite' })
            } else if (response.error.message.includes('not allowed to be empty') || response.error.message.includes('is required')) { // check on 1 missing field
                return res.status(400).json({ message: `missing required ${missedValue} field` })
            } else { // check on another problem
                return res.status(400).json({ message: `${response.error.message}` })
            }
        } else {
            const id = req.params.contactId
            const result = await Contact.findById(id).exec()
            const contact = {
                name: result.name,
                email: result.email,
                phone: result.phone,
                favorite: req.body.favorite
            }
            const editedContact = await Contact.findByIdAndUpdate(id, contact, { new: true }).exec()
            console.log(editedContact)
            if (editedContact === null) { // check on valid ID
                return res.status(404).json({ message: 'Not found' })
            }
            return res.status(200).send(editedContact)
        }
    } catch (err) {
        console.error(err.message)
        res.status(404).json({ message: 'Not found' })
    }
}

module.exports = edit