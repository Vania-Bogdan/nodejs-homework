const Contact = require('../models/contact');

async function getById(req, res, next) {
    const id = req.params.contactId
    try {
        const result = await Contact.findById(id).exec()
        console.log(result)
        if (result === null) {
            return res.status(404).send({ message: "Not found" });
        }
        return res.send(result)
    } catch (err) {
        res.status(404).json({ message: 'Not found' })
    }
}

module.exports = getById