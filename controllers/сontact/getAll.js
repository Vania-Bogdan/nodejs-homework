const Contact = require('../../models/contact');

async function getAll(req, res, next) {
    const userId = req.user.id

    try {
        const data = await Contact.find(
            { owner: userId }
        ).exec()
        return res.send(data)
    } catch (err) {
        console.error(err);
        console.log(err.message)
        res.status(500).send("Internal server error");
    }
}

module.exports = getAll;