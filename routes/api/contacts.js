const express = require('express')

const router = express.Router()

const Contacts = require('../../models/contacts')

const jsonParser = express.json();

const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
})

router.get('/', async (req, res, next) => {
  try {
    const data = await Contacts.listContacts()
    res.send(data)
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await Contacts.getContactById(contactId)

    if (!contact) {
      res.status(404).json({ message: 'Not found' })
      return
    }

    res.status(200).send(contact)
  } catch (err) {
    res.status(404).json({ message: 'Not found' })
  }
})


router.post('/', jsonParser, async (req, res, next) => {
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
      const newContact = await Contacts.addContact(req.body)
      return res.status(201).send(newContact)
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await Contacts.removeContact(contactId)
    if (result === null) {
      res.status(404).json({ message: 'Not found' })
      return
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    res.status(404).json({ message: 'Not found' })
  }


})

router.put('/:contactId', async (req, res, next) => {
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
      const { contactId } = req.params
      const updatedContact = await Contacts.updateContact(contactId, req.body)
      if (updatedContact === undefined) { // check on valid ID
        return res.status(404).json({ message: 'Not found' })
      }
      return res.status(200).send(updatedContact)
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
