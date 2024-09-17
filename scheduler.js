const cron = require('node-cron');
const { analyzeRepositories } = require('./codeAnalyzer');
const { generateSarcasticMessage } = require('./aiGenerator');
const { sendMessage } = require('./slackBot');

function scheduleDaily() {
  // Agendar para rodar todos os dias às 10:00
  cron.schedule('0 10 * * *', async () => {
    console.log('Executando tarefa diária...');
    
    const codeSmells = await analyzeRepositories();
    if (codeSmells.length > 0) {
      const randomSmell = codeSmells[Math.floor(Math.random() * codeSmells.length)];
      const sarcasticMessage = await generateSarcasticMessage(randomSmell);
      await sendMessage(sarcasticMessage);
    } else {
      await sendMessage("Uau, sem code smells hoje? Alguém deve ter hackeado nossos repositórios!");
    }
  });
}

module.exports = { scheduleDaily };