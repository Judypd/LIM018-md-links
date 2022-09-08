const fs = require('fs');
const path = require('path');
const infoServer = require('./informationServer.js');

// const myAbsolutePth = 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md'

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
    const file = route;

    const link = { href, text, file };
    groupOfLinks.push(link);
  });
  return groupOfLinks;
};

// Función que ingresa el resultado de petición http, en el array de objetos
const validateLinks = (route) => {
  const groupedLinks = findLinks(route);
  const arrPromises = [];

  groupedLinks.forEach((link) => {
    arrPromises.push(infoServer(link.href).then((res) => {
      link.status = res.status;
      res.status >= 200 && res.status < 400
        ? link.ok = res.statusText
        : link.ok = 'Fail';
    }).catch((err) => {
      link.status = err.code;
      link.ok = 'Fail';
    }));
  });
  return (Promise.all(arrPromises).then(() => groupedLinks));
};

console.log(validateLinks('./pruebas/readmePrueba.md'), 'validL');

// const stats = (arrOfObj) => {
//   const result = {};
//   const totalLinks = arrOfObj.then((res) => res.map(link => link.href));
//   console.log(totalLinks);
//   const uniqueLinks = [...new Set(totalLinks)];

//   result.total = totalLinks.length;
//   result.unique = uniqueLinks.length;
//   return result;
// };
// console.log(validateLinks('./pruebas/readmePrueba.md'));
// console.log(stats(validateLinks('./pruebas/readmePrueba.md')));
module.exports = {
  existPath,
  extensionPath,
  toAbsolutePath,
  findLinks,
  validateLinks
};
