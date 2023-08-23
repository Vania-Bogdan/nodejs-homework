const Contact = require('../../models/contact');

const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean()
})

async function update(req, res, next) {
    try {
        const response = contactSchema.validate(req.body)
        if (typeof response.error !== 'undefined') { // check on problem
            const missedValue = response.error.message.split(' ')[0].replaceAll('"', '') // clear missed value
            if (Object.keys(req.body).length === 0) { // check on empty body
                return res.status(400).json({ message: 'missing fields' })
            } else if (response.error.message.includes('not allowed to be empty') || response.error.message.includes('is required')) { // check on 1 missing field
                return res.status(400).json({ message: `missing required ${missedValue} field` })
            } else { // check on another problem
                return res.status(400).json({ message: `${response.error.message}` })
            }
        } else {
            const id = req.params.contactId

            const userId = req.user.id

            const result = await Contact.findById(id).exec()
            if (result === null) {
                return res.status(404).send({ message: "Not found" });
            }

            if (result.owner.toString() !== userId) {
                return res.status(404).send({ message: "Not found" });
            }

            const contact = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                favorite: req.body.favorite,
                owner: userId
            }
            const updatedContact = await Contact.findByIdAndUpdate(id, contact, { new: true }).exec()
            return res.status(200).send(updatedContact)
        }
    } catch (err) {
        console.error(err)
        res.status(404).json({ message: 'Not found' })
    }
}

module.exports = update