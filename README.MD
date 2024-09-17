# Bot Sarcástico de Code Smells

Um bot do Slack que diariamente zomba do seu código, porque quem precisa de amigos quando você tem um bot para apontar seus erros?

## Funcionalidades

- Envia mensagens diárias no Slack sobre diferentes code smells
- Analisa repositórios de código para encontrar exemplos reais de code smells
- Gera piadas sarcásticas sobre as práticas de codificação da equipe
- Integração com Slack para distribuição de "elogios" diários
- Usa IA para gerar conteúdo humorístico e identificar code smells

## Pré-requisitos

- Node.js (versão 14 ou superior)
- Conta no Slack com permissões para criar um bot
- Conta no GitHub com acesso aos repositórios que deseja analisar
- Chave de API da OpenAI

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/bot-sarcastico-code-smells.git
   ```
2. Entre no diretório do projeto:
   ```
   cd bot-sarcastico-code-smells
   ```
3. Instale as dependências:
   ```
   npm install
   ```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
   ```
   cp .env.example .env
   ```
2. Edite o arquivo `.env` e preencha com suas informações:
   - `SLACK_BOT_TOKEN`: Token do seu bot do Slack
   - `SLACK_CHANNEL_ID`: ID do canal do Slack onde o bot enviará mensagens
   - `GITHUB_TOKEN`: Token de acesso pessoal do GitHub
   - `OPENAI_API_KEY`: Chave da API da OpenAI
   - `GITHUB_ORG`: Nome da sua organização no GitHub

## Uso

Para iniciar o bot, execute:

```
npm start
```

O bot agora estará rodando e enviará mensagens no Slack de acordo com as configurações especificadas.

## Contribuição

Este projeto é open source e aceita contribuições! Se você encontrar algum problema ou tiver sugestões de melhorias, sinta-se à vontade para abrir uma issue ou enviar um pull request.