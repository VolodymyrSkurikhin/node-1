const fs = require("fs/promises");
const path = require("path");
const { nanoId } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function refreshContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, _, 2));
}
async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  console.log(JSON.parse(contacts));
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const oneContact = contacts.find((cont) => cont.id === contactId);
  if (!oneContact) {
    return null;
  }
  return JSON.parse(oneContact);
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const indx = contacts.findIndex((cont) => cont.id === contactId);
  if (indx === -1) {
    return null;
  }
  const [removedContact] = contacts.splice(indx, 1);
  await refreshContacts(contacts);
  return removedContact;
}

function addContact(name, email, phone) {
  const contacts = await listContacts();
  const isInList = contacts.some(item => item.name === name || item.email === email || item.phone === phone);
  if (isInList) {
    console.log('Already in list!');
    return null
  }
  const newContact = { id: nanoId(), name, email, phone };
  contacts.push(newContact);
  await listContacts(contacts);
  return JSON.parse(contacts);
}

module.exports={listContacts,getContactById, removeContact, addContact}
