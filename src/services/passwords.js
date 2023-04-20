const crypto = require('crypto');
const bcrypt = require('bcrypt');

function randomWord() {
  const randomInt = Math.floor(Math.random() * 29) + 4;
  const word = crypto.randomBytes(randomInt).toString('hex');

  return word;
}

async function hash(password) {
  if (!password) password = randomWord();

  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);

  return hashed;
}

function encrypt(password) {
  if (!password) password = randomWord();

  const encrypted = crypto.createHash('sha256').update(password).digest('hex');
  
  return encrypted;
}

function validate({ client: clientEncrypted, server: serverHashed }) {
  const isMatch = bcrypt.compare(clientEncrypted, serverHashed);

  return isMatch;
}

module.exports = { hash, encrypt, validate };
