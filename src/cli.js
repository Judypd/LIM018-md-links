#!/usr/bin/env node

const mdLinks = require('../index.js');
const chalk = require('chalk');
const args = process.argv;

// process.argv muestra los argumentos pasados por consola
// args[0] es la ruta node
// args[1] ruta de md-links
// args[2] ruta del archivo
// args[3] opción --validate o --stats

const thePath = args[2];

if (thePath === undefined) {
  console.log(chalk.cyan.italic(' Por favor ingrese la ruta al archivo o directorio que desea analizar'));
  console.log(chalk.cyan.italic('* Para mayor información escriba --help, para revisar las opciones *'));
}

if (args.length === 3 && args[3] === undefined) {
  mdLinks(thePath, { validate: false })
    .then(links => links.forEach(link =>
      console.log(`
    ** LINK FOUND **     
    ${chalk.blue(link.file)} 
    ${chalk.cyan(link.text)}
    ${chalk.magenta(link.href)} 
    `)))
    .catch(e => console.log(chalk.bgRed(' * '), chalk.red.italic(e.message)));
}

if (!(args.includes('--validate') || args.includes('--stats') || args.includes('--help')) && args.length === 4) {
  console.log(chalk.bgRed(' * '), chalk.italic('Por favor ingrese una opción válida'));
  console.log(chalk.cyan.italic('* Para mayor información escriba --help, para revisar las opciones *'));
}

if (args.length === 4 && args[3] === '--validate') {
  mdLinks(thePath, { validate: true })
    .then(arrayOfArrays => arrayOfArrays.forEach(arrayOfLinks => arrayOfLinks.forEach(link =>
      console.log(`
 ** STATUS LINK FOUND **     
  ${chalk.blue(link.file)} 
  ${chalk.cyan(link.text)}
  ${chalk.magenta(link.href)} 
  ${link.ok === 'OK' ? link.ok : chalk.yellow(link.ok)} ${link.status} 
  `)))
    )
    .catch(e => console.log(chalk.bgRed(' * '), chalk.red.italic(e.message)));
}

if (args.length === 4 && args[3] === '--stats') {
  mdLinks(thePath, { stats: true })
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
    .catch(e => console.log(chalk.bgRed(' * '), chalk.red.italic(e.message)));
}

if (args.includes('--validate') && args.includes('--stats')) {
  mdLinks(thePath, { validate: true, stats: true })
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
    .catch(e => console.log(chalk.bgRed(' * '), chalk.red.italic(e.message)));
}

if (args.includes('--help')) {
  console.log(`
    ${chalk.cyan(`                                  ${chalk.bgCyan('*** md-links-judypd ***')}

        Necesitas ayuda? Revisa las siguientes opciones:

                      Entrada                   ║                          Salida                             
     ═══════════════════════════════════════════║═══════════════════════════════════════════════════════
        md-links  path                          ║   file: ruta del archivo donde se encontró el link 
        ej.                                     ║   text: Texto qe aparecía dentro del link
          md-links directory/archivo.md         ║   href: URL encontrada                                          
     ═══════════════════════════════════════════║═══════════════════════════════════════════════════════
        md-links  path  --validate              ║   file: ruta del archivo donde se encontró el link
       *                                        ║   text: Texto qe aparecía dentro del link 
         Para saber el status de los links      ║   href: URL encontrada 
         haciendo consultas HTTP con axios      ║   status: código de respuesta HTTP
                                                ║   ok: OK en caso de éxito o FAIL en caso de fallo                             
     ═══════════════════════════════════════════║═══════════════════════════════════════════════════════
       md-links  path  --stats                  ║   Total: cantidad total de los links encontrados
       *                                        ║   Unique: cantidad de links únicos 
         Para obtener estadísticas de los links ║   
         totales y únicos encontrados           ║                                               
     ═══════════════════════════════════════════║═══════════════════════════════════════════════════════
       md-links  path  --stats  --validate      ║   Total: cantidad total de los links encontrados
       *                                        ║   Unique: cantidad de links únicos
         Para obtener estadísticas de los links ║   Broken: cantidad de links rotos
         totales, únicos y rotos encontrados    ║                        
     ═══════════════════════════════════════════║═════════════════════════════════════════════════════════
    `)}  
  `);
}
