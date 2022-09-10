const fs = require('fs');
const path = require('path');
const infoServer = require('./informationServer.js');

// Función para verificar si la ruta existe
const existPath = (route) => fs.existsSync(route);

// Funciones para verificar si la ruta es absoluta y si no, convertir a absoluta
const checkAbsolutePath = (route) => path.isAbsolute(route);

const toAbsolutePath = (route) => {
  return checkAbsolutePath(route) === false ? path.resolve(route) : route;
};

// Función que muestra la extensión de un archivo
const extensionPath = (route) => path.extname(route);

// Función para leer un archivo
const readFile = (route) => fs.readFileSync(route, 'utf-8');

// extraer links presentes en archivo .md
const findLinks = (route) => {
  const matcher = /(\[(.*?)\])?\(http(.*?)\)/gm;
  const groupOfLinks = [];

  const linksInFile = readFile(route).match(matcher);
  if (linksInFile === null) {
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
  const groupedLinks = arrayLinks.map(async link => {
    try {
      const result = await infoServer(link.href);
      link.status = result.status;
      link.ok = result.statusText;
      return link;
    } catch (e) {
      link.status = 502;
      link.ok = 'Fail';
      return link;
    }
  });
  return Promise.all(groupedLinks);
};
// validateLinks('./pruebas/readmePrueba.md').then(res => console.log(res, 'inValidL'));

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
// console.log(stats(arrObj));
// console.log(brokenStats(stats(arrObj), arrObj));

module.exports = {
  existPath,
  toAbsolutePath,
  extensionPath,
  findLinks,
  validateLinks,
  stats,
  brokenStats
};
