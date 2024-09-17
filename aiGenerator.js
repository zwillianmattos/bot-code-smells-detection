const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateSarcasticMessage(codeSmell) {
  const prompt = `Gere uma mensagem sarcástica e humorística sobre o seguinte code smell:
Tipo: ${codeSmell.type}
Mensagem: ${codeSmell.message}
Sugestão: ${codeSmell.suggestion}

A mensagem deve incluir:
1. Um comentário sarcástico sobre o problema
2. Uma piada relacionada ao tipo de code smell
3. Uma sugestão humorística de como corrigir o problema

Mantenha a mensagem concisa, com no máximo 3 frases.

Mostre o código que gerou o code smell`;

console.log(prompt);
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: prompt,
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.8,
  });

  return response.data.choices[0].text.trim();
}

module.exports = { generateSarcasticMessage };