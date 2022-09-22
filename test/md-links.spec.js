const mdLinks = require('../index.js');
const axios = require('axios');

jest.mock('axios');

describe('mdLinks', () => {
  it('should show an error message when enter a wrong path', () => {
    const wrongPath = './prueb/prueba.md';
    mdLinks(wrongPath, { validate: false })
      .catch(err => expect(err.message).toBe('La ruta ingresada no existe, porfavor ingrese una ruta válida'));
  });

  // it('Should show an error message if can not find .md document extension', () => {
  //   const noMd = './pruebas/archivo.txt';
  //   mdLinks(noMd).catch(error => expect(error.message).toBe('No se encontraron archivos con extensión .md'));
  // });

  it('If validate and stats are true, should return promise resolve with total, unique and broken links', () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, statusText: 'OK' }));
    const statsValid = [{ Total: 1, Unique: 1, Broken: 0 }];
    const onePath = './pruebas/prueba.md';
    mdLinks(onePath, { validate: true, stats: true }).then(result => expect(result).toStrictEqual(statsValid));
  });

  it('If only stats are true, should return promise resolve with total and unique links', () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, statusText: 'OK' }));
    const stats = [{ Total: 1, Unique: 1 }];
    const onePath = './pruebas/prueba.md';
    mdLinks(onePath, { stats: true }).then(result => expect(result).toStrictEqual(stats));
  });

  it('If only validate are true, should return promise resolve an array with link objects', () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, statusText: 'OK' }));
    const links = [
      [
        {
          file: 'C:\\Users\\Carola\\OneDrive\\Escritorio\\Laboratoria\\LIM018-md-links\\pruebas\\prueba.md',
          text: 'The Complete Guide to Status Codes for Meaningful R',
          href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
          status: 200,
          ok: 'OK'
        }
      ]
    ];
    const onePath = './pruebas/prueba.md';
    mdLinks(onePath, { validate: true }).then(result => expect(result).toStrictEqual(links));
  });

  it('If validate are false, should return promise resolve with an array with link objects', () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, statusText: 'OK' }));
    const links = [
      {
        file: 'C:\\Users\\Carola\\OneDrive\\Escritorio\\Laboratoria\\LIM018-md-links\\pruebas\\prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }

    ];
    const onePath = './pruebas/prueba.md';
    mdLinks(onePath, { validate: false }).then(result => expect(result).toStrictEqual(links));
  });
});
