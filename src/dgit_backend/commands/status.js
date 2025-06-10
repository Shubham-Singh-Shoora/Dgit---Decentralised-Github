const { HttpAgent, Actor } = require('@dfinity/agent');
const { getIdentity } = require('../auth');
const { idlFactory } = require('../declarations/repo_canister');

async function status() {
  try {
    const identity = await getIdentity();
    const agent = new HttpAgent({ identity, host: 'https://ic0.app' });
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.REPO_CANISTER_ID,
    });
    const repoStatus = await actor.getStatus();
    console.log('Repository status:', repoStatus);
  } catch (error) {
    console.error('Error fetching status:', error);
  }
}

module.exports = status;