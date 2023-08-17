const Contact = require('../models/contact');

async function getAll(req, res, next) {
    try {
        const data = await Contact.find().exec()
        return res.send(data)
    } catch (err) {
        console.error(err);
        console.log(err.message)
        res.status(500).send("Internal server error");
    }
}

module.exports = getAll;