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

function encrypt(value, secret) {
  if (!value) value = randomWord();

  let encrypted;

  if (secret) {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const cipher = crypto.createCipheriv('aes256', secret, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted; // Prepend the IV to the encrypted value
  } else {
    encrypted = crypto.createHash('sha256').update(value).digest('hex');
  }
  
  return encrypted;
}

function decrypt(value, secret) {
  const decipher = crypto.createDecipheriv('aes256', secret, '');
  const decrypted = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');

  return decrypted;
}

function validate({ client: clientEncrypted, server: serverHashed }) {
  const isMatch = bcrypt.compare(clientEncrypted, serverHashed);

  return isMatch;
}

module.exports = { hash, encrypt, decrypt, validate };
