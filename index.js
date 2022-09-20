const {
  existPath,
  toAbsolutePath,
  readDirectoriesAndFiles,
  findLinks,
  validateLinks,
  stats,
  brokenStats
} = require('./src/filesAndPaths.js');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (!existPath(path)) {
      return reject(new Error('La ruta ingresada no existe, porfavor ingrese una ruta válida'));
    }
    const directoriesDoc = readDirectoriesAndFiles(toAbsolutePath(path)); // array con paths de archivos .md
    const resultOfOptions = [];
    directoriesDoc.forEach(pathDoc => {
      const linksInArray = findLinks(pathDoc);
      // console.log(linksInArray, 'linksinarray');

      if (options.validate === true && options.stats === true) {
        return resultOfOptions.push(validateLinks(linksInArray).then((result) => brokenStats(stats(result), result)));
      }
      if (options.stats === true) {
        return resultOfOptions.push(validateLinks(linksInArray).then((result) => stats(result)));
      }
      if (options.validate === true) {
        // console.log(validateLinks(linksInArray), 'validatelinks');
        return resultOfOptions.push(validateLinks(linksInArray).then(result => result));
      }
      return resultOfOptions.push(linksInArray);
    });

    resolve(Promise.all(resultOfOptions));
  });
};

// mdLinks('./pruebas', { validate: true, stats: true })
//   .then((res) => console.log(res, 'mdlinks'))
//   .catch((e) => console.log(e.message));

module.exports = mdLinks;
