const express = require('express')

const router = express.Router()

const Contacts = require('../../models/contacts')

const jsonParser = express.json();

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
  const { contactId } = req.params
  const contact = await Contacts.getContactById(contactId)

  if (!contact) {
    res.status(404).json({ message: 'Not found' })
  }

  res.status(200).send(contact)
})

router.post('/', jsonParser, async (req, res, next) => {
  const newContact = await Contacts.addContact(req.body)
  if (!newContact) {
    res.status(400).json({ message: "missing required name field" })
  }
  res.status(201).send(newContact)
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const result = await Contacts.removeContact(contactId)
  if (result === null) {
    res.status(404).json({ message: 'Not found' })
  }
  res.status(200).json({ message: "contact deleted" });
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const updatedContact = await Contacts.updateContact(contactId, req.body)
  if (updatedContact === undefined) {
    res.status(404).json({ message: 'Not found' })
  }
  if (updatedContact === null) {
    res.status(400).json({ message: 'missing fields' })
  }
  res.status(200).send(updatedContact)
})

module.exports = router
