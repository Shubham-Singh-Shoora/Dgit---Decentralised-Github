const { HttpAgent, Actor } = require('@dfinity/agent');
const { getIdentity } = require('../auth');
const fs = require('fs-extra');
const { idlFactory } = require('../declarations/repo_canister');

async function commit(options) {
  try {
    const identity = await getIdentity();
    const agent = new HttpAgent({ identity, host: 'https://ic0.app' });
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.REPO_CANISTER_ID,
    });
    const files = fs.readdirSync('.').filter(file => file.endsWith('.mo') || file.endsWith('.rs'));
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      await actor.commitCode(file, content, options.message);
    }
    console.log('Changes committed successfully.');
  } catch (error) {
    console.error('Error committing changes:', error);
  }
}

module.exports = commit;