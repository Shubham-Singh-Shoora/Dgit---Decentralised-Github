const { Ed25519KeyIdentity } = require('@dfinity/identity');
const fs = require('fs-extra');

async function getIdentity() {
  const keyPath = './dgit-identity.json';
  if (fs.existsSync(keyPath)) {
    const keyData = fs.readJsonSync(keyPath);
    return Ed25519KeyIdentity.fromJSON(JSON.stringify(keyData));
  } else {
    const identity = Ed25519KeyIdentity.generate();
    fs.writeJsonSync(keyPath, identity.toJSON());
    console.log('New identity generated and saved to', keyPath);
    return identity;
  }
}

module.exports = { getIdentity };