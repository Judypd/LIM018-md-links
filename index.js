const {
  existPath,
  extensionPath,
  toAbsolutePath,
  findLinks,
  validateLinks,
  stats,
  brokenStats
} = require('./src/filesAndPaths.js');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    const linksInArray = findLinks(toAbsolutePath(path));

    if (existPath(path) === false) {
      reject(new Error('La ruta ingresada no existe, porfavor ingrese una ruta válida'));
    }
    if (extensionPath(toAbsolutePath(path)) !== '.md') {
      reject(new Error('No hay archivos con extensión .md'));
      // return console.log('No hay archivos con extensión .md');
    }
    if (linksInArray === []) {
      reject(new Error());
    } else {
      if (options.validate === true && options.stats === true) {
        resolve(validateLinks(linksInArray).then((result) => brokenStats(stats(result), result)));
      }
      if (options.stats === true) {
        resolve(validateLinks(linksInArray).then((result) => stats(result)));
      }
      if (options.validate === false) {
        resolve(linksInArray);
      } else {
        resolve(validateLinks(linksInArray));
      }
    }
  });
};

mdLinks('./directory/file/prueba1.md', { validate: true })
  .then((res) => console.log(res, 'mdlinks'))
  .catch((e) => console.log(e.message, 'errorMdLink'));

module.exports = mdLinks;
