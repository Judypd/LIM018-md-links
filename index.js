const {
  existPath,
  extensionPath,
  toAbsolutePath,
  findLinks,
  validateLinks
} = require('./src/filesAndPaths.js');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (existPath(path) === false) {
      return console.log('La ruta ingresada no existe, porfavor ingrese una ruta válida');
    }
    if (extensionPath(toAbsolutePath(path)) !== '.md') {
      return console.log('No hay archivos con extensión .md');
    }
    if (findLinks(toAbsolutePath(path)) === []) {
      return console.log('No se encontraron links en el archivo');
    } else {
      if (options.validate === false) {
        console.log('validate false');
        resolve(findLinks(toAbsolutePath(path)));
      } else {
        console.log('validate true');
        resolve(validateLinks(toAbsolutePath(path)));
      }
    }
  });
};

mdLinks('./pruebas/readmePrueba.md', { validate: true }).then((res) => console.log(res, 'mdlinks')).catch(console.log);

module.exports = mdLinks;
