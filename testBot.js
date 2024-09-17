require('dotenv').config();
const { analyzeRepositories } = require('./codeAnalyzer');
const { generateSarcasticMessage } = require('./aiGenerator');

async function runTest() {
  try {
    console.log('Analisando repositórios...');
    const codeSmells = await analyzeRepositories();
    
    if (codeSmells.length === 0) {
      console.log('Nenhum code smell encontrado. Seu código é perfeito... ou será que o bot está com defeito?');
      return;
    }

    console.log(`Encontrados ${codeSmells.length} code smells. Gerando mensagens sarcásticas...\n`);

    for (const smell of codeSmells) {
      const sarcasticMessage = await generateSarcasticMessage(smell);
      console.log('Code Smell:');
      console.log(`Tipo: ${smell.type}`);
      console.log(`Arquivo: ${smell.message.split(':')[0]}`);
      console.log(`Mensagem Sarcástica: ${sarcasticMessage}\n`);
    }
  } catch (error) {
    console.error('Erro ao executar o teste:', error);
  }
}

runTest();