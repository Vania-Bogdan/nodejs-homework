const express = require('express')

const router = express.Router()

const ContactController = require('../../controllers/сontact/index')

const jsonParser = express.json();

router.get('/', ContactController.getAll)

router.get('/:contactId', ContactController.getById)

router.post('/', jsonParser, ContactController.create)

router.delete('/:contactId', ContactController.remove)

router.put('/:contactId', jsonParser, ContactController.update)

router.patch('/:contactId/favorite', jsonParser, ContactController.edit)

module.exports = router
