#!/usr/bin/env node

const mdLinks = require('../index.js');
const chalk = require('chalk');
const args = process.argv;
// process.argv muestra los argumentos pasados por consola
// args[0] es la ruta node
// args[1] ruta de md-links
// args[2] ruta del archivo

if (args[3] === undefined) {
  mdLinks(args[2], { validate: false })
    .then(links => links.forEach(link =>
      console.log(`${chalk.blue(args[2])} ${chalk.magenta(link.href)} ${chalk.cyan(link.text)}`)))
    .catch(e => console.log(e.message));
}

if (args.length === 4 && args[3] === '--validate') {
  mdLinks(args[2], { validate: true })
    .then(links => links.forEach(link =>
      console.log(`${chalk.blue(args[2])} ${chalk.magenta(link.href)} ${link.ok} ${link.status} ${chalk.cyan(link.text)}`)))
    .catch(e => console.log(e.message));
}

if (args.length === 4 && args[3] === '--stats') {
  mdLinks(args[2], { stats: true })
    .then(links =>
      console.log(`
${chalk.bgMagenta('Total:  ')}${chalk.bgMagenta(links.Total)}
${chalk.bgCyan('Unique: ')}${chalk.bgCyan(links.Unique)}  
    `))
    .catch(e => console.log(e.message));
}

if ((args[3] === '--stats' && args[4] === '--validate') || (args[3] === '--validate' && args[4] === '--stats')) {
  mdLinks(args[2], { validate: true, stats: true })
    .then(links =>
      console.log(`
${chalk.bgMagenta('Total:  ')}${chalk.bgMagenta(links.Total)}
${chalk.bgCyan('Unique: ')}${chalk.bgCyan(links.Unique)}
${chalk.bgYellow('Broken: ')}${chalk.bgYellow(links.Broken)}    
      `))
    .catch(e => console.log(e.message));
}
