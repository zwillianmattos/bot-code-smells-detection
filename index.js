require('dotenv').config();
const { startBot } = require('./slackBot');
const { scheduleDaily } = require('./scheduler');

async function main() {
  await startBot();
  scheduleDaily();
}

main().catch(console.error);