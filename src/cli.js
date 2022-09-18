#!/usr/bin/env node

const mdLinks = require('../index.js');
const chalk = require('chalk');
const args = process.argv;
// process.argv muestra los argumentos pasados por consola
// args[0] es la ruta node
// args[1] ruta de md-links
// args[2] ruta del archivo

// eslint-disable-next-line no-mixed-operators
if ((args[3] !== undefined && args[3] !== '--validate' && args[3] !== '--stats')) {
  console.log(chalk.bgRed(' Error: Por favor ingrese una opción válida'));
}

if (args[3] === undefined) {
  mdLinks(args[2], { validate: false })
    .then(links => links.forEach(link =>
      console.log(`
** LINK FOUND **     
  ${chalk.blue(args[2])} 
  ${chalk.magenta(link.href)} 
  ${chalk.cyan(link.text)}`)))
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}

if (args.length === 4 && args[3] === '--validate') {
  mdLinks(args[2], { validate: true })
    .then(links => links.forEach(link =>
      console.log(`
** STATUS LINK FOUND **     
    ${chalk.blue(args[2])} 
    ${chalk.magenta(link.href)} 
    ${link.ok === 'OK' ? link.ok : chalk.yellow(link.ok)} ${link.status} 
    ${chalk.cyan(link.text)}`)))
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}

if (args.length === 4 && args[3] === '--stats') {
  mdLinks(args[2], { stats: true })
    .then(links =>
      console.log(`
             S T A T S
   ============================== 
       ${chalk.cyan('Total  :  ')}${chalk.blue(links.Total)}
       ${chalk.cyan('Unique :  ')}${chalk.blue(links.Unique)}
   ==============================      
    `))
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}

if ((args[3] === '--stats' && args[4] === '--validate') || (args[3] === '--validate' && args[4] === '--stats')) {
  mdLinks(args[2], { validate: true, stats: true })
    .then(links =>
      console.log(`
     C O M P L E T E  S T A T S
   ============================== 
       ${chalk.cyan('Total    :  ')}${chalk.blue(links.Total)}
       ${chalk.cyan('Unique   :  ')}${chalk.blue(links.Unique)}
       ${chalk.yellow('Broken   :  ')}${chalk.yellow(links.Broken)}
   ==============================        
      `))
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}
