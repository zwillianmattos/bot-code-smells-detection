const { WebClient } = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function startBot() {
  try {
    await slack.auth.test();
    console.log('Bot conectado ao Slack com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar o bot ao Slack:', error);
  }
}

async function sendMessage(message) {
  try {
    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: message,
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

module.exports = { startBot, sendMessage };