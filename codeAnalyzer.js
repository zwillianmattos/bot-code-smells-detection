const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function analyzeRepositories() {
  try {
    console.log(`Listando repositórios para: ${process.env.GITHUB_ORG}`);
    const repos = await octokit.repos.listForOrg({
      org: process.env.GITHUB_ORG,
      type: 'all',
    });
    
    console.log(`Encontrados ${repos.data.length} repositórios.`);

    const codeSmells = [];

    for (const repo of repos.data) {
      console.log(`Analisando repositório: ${repo.name}`);
      const files = await listFiles(repo.name, '');
      
      for (const file of files) {
        console.log(`Analisando arquivo: ${file.path}`);
        if (file.name.endsWith('.js')) {
          const jsSmells = await analyzeJavaScriptFile(repo.name, file.path);
          codeSmells.push(...jsSmells);
        } else if (file.name.endsWith('.php')) {
          const phpSmells = await analyzePHPFile(repo.name, file.path);
          codeSmells.push(...phpSmells);
        } else if (file.isDirectory) {
          const subFiles = await listFiles(repo.name, file.path);
          codeSmells.push(...subFiles);
        }
      }
    }

    return codeSmells;
  } catch (error) {
    console.error('Erro ao analisar repositórios:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    throw error;
  }
}

async function listFiles(repo, path) {
  const { data } = await octokit.repos.getContent({
    owner: process.env.GITHUB_ORG,
    repo: repo,
    path: path,
  });

  let allFiles = [];

  for (const item of data) {
    if (item.type === 'file') {
      allFiles.push(item);
    } else if (item.type === 'dir') {
      const subFiles = await listFiles(repo, item.path);
      allFiles = allFiles.concat(subFiles);
    }
  }

  return allFiles;
}

async function analyzeJavaScriptFile(repo, path) {
  const { data } = await octokit.repos.getContent({
    owner: process.env.GITHUB_ORG,
    repo: repo,
    path: path,
  });
  const content = Buffer.from(data.content, 'base64').toString();
  const smells = [];

  // Check file size
  if (content.length > 1000) {
    smells.push({
      type: 'Large File',
      message: `Arquivo muito grande em ${repo}/${path}: Considere dividir em módulos menores.`,
      suggestion: 'Divida o arquivo em módulos menores e mais focados.'
    });
  }

  // Check for var usage
  if (content.includes('var ')) {
    smells.push({
      type: 'Var Usage',
      message: `Uso de 'var' em ${repo}/${path}: Prefira 'let' ou 'const' para melhor escopo de variáveis.`,
      suggestion: 'Substitua "var" por "let" para variáveis que mudam, e "const" para as que não mudam.'
    });
  }

  // Check for anonymous functions
  if (content.match(/function\s*\(\)\s*{/g)) {
    smells.push({
      type: 'Anonymous Functions',
      message: `Funções anônimas em ${repo}/${path}: Considere usar arrow functions para melhor legibilidade.`,
      suggestion: 'Use arrow functions (=>) para funções anônimas mais concisas.'
    });
  }

  // Check for long functions
  const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/g;
  const functions = content.match(functionRegex) || [];
  functions.forEach(func => {
    if (func.split('\n').length > 20) {
      smells.push({
        type: 'Long Function',
        message: `Função longa detectada em ${repo}/${path}: Considere dividir em funções menores.`,
        suggestion: 'Divida a função em subfunções menores e mais específicas.'
      });
    }
  });

  // Check for complex conditions
  const complexConditionRegex = /if\s*\([^)]{50,}\)/g;
  if (content.match(complexConditionRegex)) {
    smells.push({
      type: 'Complex Condition',
      message: `Condição complexa detectada em ${repo}/${path}: Simplifique para melhor legibilidade.`,
      suggestion: 'Extraia condições complexas para variáveis ou funções com nomes descritivos.'
    });
  }

  return smells;
}

async function analyzePHPFile(repo, path) {
  const { data } = await octokit.repos.getContent({
    owner: process.env.GITHUB_ORG,
    repo: repo,
    path: path,
  });
  const content = Buffer.from(data.content, 'base64').toString();
  const smells = [];

  // Check file size
  if (content.length > 1000) {
    smells.push({
      type: 'Large File',
      message: `Arquivo PHP muito grande em ${repo}/${path}: Considere dividir em classes ou funções menores.`,
      suggestion: 'Divida o arquivo em classes menores ou módulos separados.'
    });
  }

  // Check for global variables
  if (content.includes('global $')) {
    smells.push({
      type: 'Global Variables',
      message: `Uso de variáveis globais em ${repo}/${path}: Evite o uso de variáveis globais, prefira injeção de dependência.`,
      suggestion: 'Use injeção de dependência ou padrões de design como Singleton para gerenciar estado global.'
    });
  }

  // Check for direct $_GET or $_POST usage
  if (content.match(/\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*\s*=\s*\$_GET|\$_POST/g)) {
    smells.push({
      type: 'Unsanitized Input',
      message: `Uso direto de $_GET ou $_POST em ${repo}/${path}: Valide e sanitize as entradas do usuário.`,
      suggestion: 'Use funções como filter_input() para validar e sanitizar entradas do usuário.'
    });
  }

  // Check for long functions
  const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/g;
  const functions = content.match(functionRegex) || [];
  functions.forEach(func => {
    if (func.split('\n').length > 20) {
      smells.push({
        type: 'Long Function',
        message: `Função longa detectada em ${repo}/${path}: Considere dividir em funções menores.`,
        suggestion: 'Divida a função em métodos menores e mais específicos.'
      });
    }
  });

  // Check for complex SQL queries
  if (content.match(/SELECT[\s\S]{100,}FROM/i)) {
    smells.push({
      type: 'Complex SQL Query',
      message: `Query SQL complexa detectada em ${repo}/${path}: Considere otimizar ou usar um ORM.`,
      suggestion: 'Use um ORM como Doctrine ou Eloquent para queries complexas, ou divida em subqueries.'
    });
  }

  return smells;
}

module.exports = { analyzeRepositories };