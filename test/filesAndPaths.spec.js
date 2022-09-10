const {
  existPath,
  toAbsolutePath,
  extensionPath,
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
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: './pruebas/prueba.md'
      }
    ];

    expect(findLinks(myPth)).toEqual(result);
  });

  it('Should enter only 50 characters in the text property of the link objects', () => {
    const myPth = './pruebas/prueba.md';
    const otherPath = './directory/file/prueba1.md';
    const result1 = [
      {
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: './pruebas/prueba.md'
      }
    ];
    const result2 = [
      {
        href: 'https://nodejs.org/api/path.html',
        text: 'Path',
        file: './directory/file/prueba1.md'
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
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md'
      }
    ];
    return validateLinks(linksTest).then(response => expect(response).toStrictEqual([
      {
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
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
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md'
      }
    ];
    return validateLinks(linksTest).catch((response) => expect(response).toStrictEqual([
      {
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md',
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
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md'
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
        href: 'https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5',
        text: 'The Complete Guide to Status Codes for Meaningful R',
        file: 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md'
      }
    ];
    const statLinks = stats(linksTest);
    const result = { Total: 1, Unique: 1, Broken: 0 };

    expect(brokenStats(statLinks, linksTest)).toEqual(result);
  });
});
