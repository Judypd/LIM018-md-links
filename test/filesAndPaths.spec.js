const {
  existPath,
  toAbsolutePath,
  extensionPath,
  readFile,
  readDirectoriesAndFiles,
  findLinks,
  validateLinks,
  stats,
  brokenStats
} = require('../src/filesAndPaths.js');
const axios = require('axios');

jest.mock('axios');

describe('existPath', () => {
  it('should verify if the path exist', () => {
    const myAbsolutePth = 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md';
    expect(existPath(myAbsolutePth)).toBe(true);
  });
  it('should return false if the path does not exist', () => {
    const onePath = './prueba/prueba.md';
    expect(existPath(onePath)).toBe(false);
  });
});

describe('toAbsolutePath', () => {
  it('should convert a path in absolute if it is a relative path', () => {
    const myAbsolutePth = 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md';
    const onePath = './pruebas/prueba.md';
    const exp = 'C:\\Users\\Carola\\OneDrive\\Escritorio\\Laboratoria\\LIM018-md-links\\pruebas\\prueba.md';
    expect(toAbsolutePath(onePath)).toBe(exp);
    expect(toAbsolutePath(myAbsolutePth)).toBe('C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md');
  });
});

describe('extensionPath', () => {
  it('Should verified extension of the document', () => {
    const myPth = './pruebas/prueba.md';
    const text = './pruebas/archivo.txt';
    expect(extensionPath(myPth)).toBe('.md');
    expect(extensionPath(text)).toBe('.txt');
  });
});

describe('readFile', () => {
  it('Should read the content of a .md document', () => {
    const fileMd = './directory/file/text.md';
    const result = 'Hola mundo';
    expect(readFile(fileMd)).toBe(result);
  });
  it('Should show a message if document has not a .md extension', () => {
    const fileTxt = './pruebas/archivo.txt';
    const result = 'No se encontraron archivos con extensión .md';
    expect(readFile(fileTxt)).toBe(result);
  });
});

describe('readDirectoriesAndFiles', () => {
  it('Should scan a directory and return an array with paths', () => {
    const directoryPath = './directory';
    const result = [
      'directory\\file\\direct2\\file2\\new.md',
      'directory\\file\\prueba1.md',
      'directory\\file\\text.md'];
    expect(readDirectoriesAndFiles(directoryPath)).toEqual(result);
  });
});

describe('findLinks', () => {
  it('Should return an empty array when can not find links', () => {
    const noLinks = './pruebas/prueba2.md';
    const result = [];
    expect(findLinks(noLinks)).toEqual(result);
  });

  it('Should extract links in .md documents and return an array of objects', () => {
    const myPth = './pruebas/prueba.md';
    const result = [
      {
        file: './pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }
    ];

    expect(findLinks(myPth)).toEqual(result);
  });

  it('Should enter only 50 characters in the text property of the link objects', () => {
    const myPth = './pruebas/prueba.md';
    const otherPath = './directory/file/prueba1.md';
    const result1 = [
      {
        file: './pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }
    ];
    const result2 = [
      {
        file: './directory/file/prueba1.md',
        text: 'Path',
        href: 'https://nodejs.org/api/path.html'
      }
    ];
    expect(findLinks(myPth)).toEqual(result1);
    expect(findLinks(otherPath)).toEqual(result2);
  });
});

describe('validateLinks', () => {
  it('When the HTTP request is successful, should add the properties status 200 and Ok inside each link object', () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, statusText: 'OK' }));
    const linksTest = [
      {
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }
    ];
    return validateLinks(linksTest).then(response => expect(response).toStrictEqual([
      {
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        status: 200,
        ok: 'OK'
      }
    ]));
  });

  it('When the HTTP request fail, should add the properties status 502 and Fail inside each link object', () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    axios.get.mockImplementation(() => Promise.reject());
    const linksTest = [
      {
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }
    ];
    return validateLinks(linksTest).catch((response) => expect(response).toStrictEqual([
      {
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        status: 502,
        ok: 'Fail'
      }
    ]));
  });
});

describe('stats', () => {
  it('Should return total and unique links', () => {
    const linksTest = [
      {
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }
    ];
    const result = { Total: 1, Unique: 1 };

    expect(stats(linksTest)).toStrictEqual(result);
  });
});

describe('brokenStats', () => {
  it('Should return total, unique and broken links', () => {
    const linksTest = [
      {
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5'
      }
    ];
    const statLinks = stats(linksTest);
    const result = { Total: 1, Unique: 1, Broken: 0 };

    expect(brokenStats(statLinks, linksTest)).toEqual(result);
  });
});
