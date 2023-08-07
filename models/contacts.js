const fs = require('fs/promises')
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

async function read() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

function write(data) {
  return fs.writeFile(contactsPath, JSON.stringify(data));
}


const listContacts = async () => {
  const data = await read();
  return data;
}

const getContactById = async (contactId) => {
  const data = await read()
  const index = data.findIndex((contact) => contact.id === contactId)
  if (index === -1) {
    return null
  }
  return data[index]
}

const removeContact = async (contactId) => {
  const data = await read()
  const index = data.findIndex((contact) => contact.id === contactId)
  if (index === -1) {
    return null
  }

  const newContacts = [...data.slice(0, index), ...data.slice(index + 1)]
  await write(newContacts)
  return
}

const addContact = async (body) => {
  const data = await read()
  const { name, email, phone } = body
  if (!name || !email || !phone) {
    return null
  }
  const newContact = {
    id: crypto.randomUUID(),
    name: name,
    email: email,
    phone: phone,
  }
  const newContacts = [...data, newContact]
  await write(newContacts)

  return newContact
}

const updateContact = async (contactId, body) => {
  const data = await read()
  const index = data.findIndex((contact) => contact.id === contactId)
  if (index === -1) {
    return undefined
  }
  const { name, email, phone } = body
  if (!name || !email || !phone) {
    return null
  }
  const newContact = {
    id: contactId,
    name: name,
    email: email,
    phone: phone,
  }
  const newContacts = [...data.slice(0, index), newContact, ...data.slice(index + 1)]
  await write(newContacts)

  return newContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
