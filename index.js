const {
  existPath,
  extensionPath,
  toAbsolutePath,
  findLinks
} = require('./src/filesAndPaths.js')

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (existPath(path) === false) {
      reject(new Error('La ruta ingresada no es válida'))
    }
    if (extensionPath(toAbsolutePath(path)) === '.md') {
      resolve(findLinks(toAbsolutePath(path)))
    }
    // resolve('algo')
  })
}

mdLinks('./pruebas/readmePrueba.md').then((res) => console.log(res)).catch(console.log)
// console.log(findLinks('./pruebas/readmePrueba.md')[1].href);
module.exports = mdLinks
