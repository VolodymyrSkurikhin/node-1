const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function refreshContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}
async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  // console.table(JSON.parse(contacts));
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const oneContact = contacts.find((cont) => cont.id === contactId);
  if (!oneContact) {
    console.log("not found");
    return null;
  }
  console.log(oneContact);
  return oneContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const indx = contacts.findIndex((cont) => cont.id === contactId);
  if (indx === -1) {
    return null;
  }
  const [removedContact] = contacts.splice(indx, 1);
  await refreshContacts(contacts);
  contacts = await listContacts();
  console.table(contacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const isInList = contacts.some(
    (item) => item.name === name || item.email === email || item.phone === phone
  );
  if (isInList) {
    console.log("Already in list!");
    return null;
  }
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await refreshContacts(contacts);
  contacts = await listContacts();
  console.table(contacts);
  return contacts;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
