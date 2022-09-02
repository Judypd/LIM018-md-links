const filesAndPaths = require('./src/filesAndPaths.js')

const mdLinks = (path, options) => {
  new Promise((resolve, reject) => {
    if(filesAndPaths.existPath(path) === false){
      reject('La ruta ingresada no es válida')
    }
    if(filesAndPaths.extensionPath(filesAndPaths.toAbsolutePath(path)) === '.md'){
      filesAndPaths.findLinks(filesAndPaths.toAbsolutePath(path));
    }
    resolve('algo')
    
  })
};

mdLinks('./pruebas/prueba.md').then((res) => console.log(res)).catch(console.log)
// console.log(filesAndPaths.findLinks('./pruebas/readmePrueba.md')[1].href);
module.exports = mdLinks;
