const { HttpAgent, Actor } = require('@dfinity/agent');

const { getIdentity } = require('../auth');
const { idlFactory } = require('../declarations/repo_canister');

async function init() {
  try {
    const identity = await getIdentity();
    const agent = new HttpAgent({ identity, host: 'https://ic0.app' });
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.REPO_CANISTER_ID,
    });
    const repoId = await actor.createRepo();
    console.log(`Repository initialized with ID: ${repoId}`);
  } catch (error) {
    console.error('Error initializing repository:', error);
  }
}

module.exports = init;