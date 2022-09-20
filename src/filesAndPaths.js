const fs = require('fs');
const path = require('path');
const infoServer = require('./informationServer.js');
const chalk = require('chalk');

// const rutaDir = './directory/file';
// Función para verificar si la ruta existe
const existPath = (route) => fs.existsSync(route);

// Funciones para verificar si la ruta es absoluta y si no, convertir a absoluta
const checkAbsolutePath = (route) => path.isAbsolute(route);

const toAbsolutePath = (route) => {
  return checkAbsolutePath(route) === false ? path.resolve(route) : route;
};

// Función que muestra la EXTENSIÓN de un archivo
const extensionPath = (route) => path.extname(route);

// Función para validar si se trata de un DIRECTORIO
const isADirectory = (route) => fs.statSync(route).isDirectory(); // true o false

// Función para leer un directorio
const docsInDirectory = (route) => fs.readdirSync(route, 'utf-8');

// Función recursiva para leer un directorio
const readDirectoriesAndFiles = (route) => {
  if (!isADirectory(route)) {
    return [route];
  }
  const groupedDocs = docsInDirectory(route);
  // console.log(groupedDocs, 'docsindirectory');
  const allFiles = groupedDocs.map(elem => {
    const completePaths = path.join(route, elem);
    // console.log(completePaths, 'elem');
    // console.log(isADirectory(completePaths));
    return isADirectory(completePaths) ? readDirectoriesAndFiles(completePaths) : completePaths;
  });
  // console.log(allFiles, 'allfiles');
  const cleanFiles = allFiles.flat().filter(file => extensionPath(file) === '.md');
  // console.log(cleanFiles, 'cleanfiles');
  return cleanFiles;
};
// console.log(readDirectoriesAndFiles('./pruebas'), 'resultado');

// Función para leer solo un archivo que tiene extensión .md
const readFile = (route) => extensionPath(route) === '.md'
  ? fs.readFileSync(route, 'utf-8')
  : 'No se encontraron archivos con extensión .md';
;

// Extraer links presentes en archivo .md
const findLinks = (route) => {
  const matcher = /(\[(.*?)\])?\(http(.*?)\)/gm;
  const groupOfLinks = [];

  const linksInFile = readFile(route).match(matcher);
  if (linksInFile === null) {
    console.log(chalk.bgRed(' Error: ') + chalk.red.italic(' No se encontraron links en el/los archivo(s)'));
    return [];
  }
  linksInFile.forEach((elem) => {
    const parentheses = /\(([^)]+)\)/;
    const matchHttp = parentheses.exec(elem);
    const href = matchHttp[1];
    const text = elem.slice(1, elem.indexOf(']'));
    const correctText = text.length > 50 ? text.slice(0, 51) : text;
    const file = route;

    const link = {
      href,
      text: correctText,
      file
    };
    groupOfLinks.push(link);
  });
  return groupOfLinks;
};

// Función que ingresa el resultado de petición http, en el array de objetos
const validateLinks = (arrayLinks) => {
  const groupedLinks = arrayLinks.map(link =>
    infoServer(link.href)
      .then(result => {
        link.status = result.status;
        link.ok = result.statusText;
        return link;
      }).catch(e => {
        link.status = 502;
        link.ok = 'Fail';
        return link;
      })
  );
  return Promise.all(groupedLinks);
};

// funciones para representar estadísticas del total de links encontrados
const stats = (arrOfObj) => {
  const result = {};
  const totalLinks = arrOfObj.map(link => link.href);
  const uniqueLinks = [...new Set(totalLinks)];

  result.Total = totalLinks.length;
  result.Unique = uniqueLinks.length;
  return result;
};

const brokenStats = (stat, arrOfObj) => {
  const broken = arrOfObj.filter(link => link.ok === 'Fail');
  stat.Broken = broken.length;
  return stat;
};

module.exports = {
  existPath,
  toAbsolutePath,
  readDirectoriesAndFiles,
  findLinks,
  validateLinks,
  stats,
  brokenStats
};
