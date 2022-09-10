const mdLinks = require('../index.js');

describe('mdLinks', () => {
  it('should show an error message when enter a wrong path', () => {
    const wrongPath = './prueb/prueba.md';
    mdLinks(wrongPath, { validate: false })
      .catch(err => expect(err.message).toBe('La ruta ingresada no existe, porfavor ingrese una ruta válida'));
  });

  it('Should show an error message if can not find .md document extension', () => {
    const noMd = './pruebas/archivo.txt';
    mdLinks(noMd).catch(error => expect(error.message).toBe('No hay archivos con extensión .md'));
  });
});
