const Contact = require('../models/contact');

async function remove(req, res, next) {
    const id = req.params.contactId
    try {
        const result = await Contact.findByIdAndRemove(id).exec()
        console.log(result)
        if (result === null) {
            return res.status(404).send({ message: "Not found" });
        }
        return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
        res.status(404).json({ message: 'Not found' })
    }
}

module.exports = remove