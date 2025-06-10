const { HttpAgent, Actor } = require('@dfinity/agent');
const { getIdentity } = require('../auth');
const fs = require('fs-extra');
const { idlFactory } = require('../declarations/repo_canister');

async function clone(repoId) {
  try {
    const identity = await getIdentity();
    const agent = new HttpAgent({ identity, host: 'https://ic0.app' });
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.REPO_CANISTER_ID,
    });
    const files = await actor.listFiles(repoId);
    const repoDir = `./dgit-repo-${repoId}`;
    fs.ensureDirSync(repoDir);
    for (const file of files) {
      const content = await actor.getFile(repoId, file);
      fs.writeFileSync(`${repoDir}/${file}`, content);
    }
    console.log(`Repository ${repoId} cloned to ${repoDir}`);
  } catch (error) {
    console.error('Error cloning repository:', error);
  }
}

module.exports = clone;