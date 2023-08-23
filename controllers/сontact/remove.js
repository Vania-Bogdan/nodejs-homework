const Contact = require('../../models/contact');

async function remove(req, res, next) {
    const id = req.params.contactId

    const userId = req.user.id

    try {
        const doc = await Contact.findById(id).exec()
        if (doc === null) {
            return res.status(404).send({ message: "Not found" });
        }

        if (doc.owner.toString() !== userId) {
            return res.status(404).send({ message: "Not found" });
        }
        await Contact.findByIdAndRemove(id).exec()
        return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
        res.status(404).json({ message: 'Not found' })
    }
}

module.exports = remove