#!/usr/bin/env node

const mdLinks = require('../index.js');
const chalk = require('chalk');
const args = process.argv;
// process.argv muestra los argumentos pasados por consola
// args[0] es la ruta node
// args[1] ruta de md-links
// args[2] ruta del archivo

if (args[2] === undefined) {
  console.log(chalk.blue.italic(' Por favor ingrese la ruta al archivo o directorio que desea revisar'));
  console.log(chalk.blue.italic('* Para mayor información escriba --help, para revisar las opciones *'));
}

if (args.length === 3 && args[3] === undefined) {
  mdLinks(args[2], { validate: false })
    .then(links => links.forEach(link =>
      console.log(`
    ** LINK FOUND **     
    ${chalk.blue(link.file)} 
    ${chalk.cyan(link.text)}
    ${chalk.magenta(link.href)} 
    `)))
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}

if ((args.length === 4 && args[3] !== '--validate' && args[3] !== '--stats') ||
   (args.length === 4 && args[4] !== '--validate' && args[4] !== '--stats')) {
  console.log(chalk.bgRed.italic(' Error: Por favor ingrese una opción válida'));
}

if (args.length === 4 && args[3] === '--validate') {
  mdLinks(args[2], { validate: true })
    .then(arrayOfArrays => arrayOfArrays.forEach(arrayOfLinks => arrayOfLinks.forEach(link =>
      console.log(`
 ** STATUS LINK FOUND **     
  ${chalk.blue(link.file)} 
  ${chalk.cyan(link.text)}
  ${chalk.magenta(link.href)} 
  ${link.ok === 'OK' ? link.ok : chalk.yellow(link.ok)} ${link.status} 
  `)))
    )
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}

if (args.length === 4 && args[3] === '--stats') {
  mdLinks(args[2], { stats: true })
    .then(links => {
      const result = {};
      links.forEach(link => {
        for (const [key, value] of Object.entries(link)) {
          if (result[key]) {
            result[key] += value;
          } else {
            result[key] = value;
          }
        }
      }
      );
      console.log(`
           S T A T S
 ============================== 
     ${chalk.cyan('Total  :  ')}${chalk.blue(result.Total)}
     ${chalk.cyan('Unique :  ')}${chalk.blue(result.Unique)}
 ==============================      
  `);
      return result;
    }
    )
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}

if ((args[3] === '--stats' && args[4] === '--validate') || (args[3] === '--validate' && args[4] === '--stats')) {
  mdLinks(args[2], { validate: true, stats: true })
    .then(links => {
      const result = {};
      links.forEach(link => {
        for (const [key, value] of Object.entries(link)) {
          if (result[key]) {
            result[key] += value;
          } else {
            result[key] = value;
          }
        }
      }
      );
      console.log(`
    C O M P L E T E  S T A T S
    ============================== 
      ${chalk.cyan('Total    :  ')}${chalk.blue(result.Total)}
      ${chalk.cyan('Unique   :  ')}${chalk.blue(result.Unique)}
      ${chalk.yellow('Broken   :  ')}${chalk.yellow(result.Broken)}
    ==============================                 
`);
      return result;
    }
    )
    .catch(e => console.log(chalk.bgRed(' Error: '), chalk.red.italic(e.message)));
}
