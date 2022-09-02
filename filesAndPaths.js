const fs = require('fs');
const path = require('path');


const myAbsolutePth = 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md';

const existPath = (route) => fs.existsSync(route);
console.log(existPath(myAbsolutePth));

const checkAbsolutePath = (route) => path.isAbsolute(route);
console.log(checkAbsolutePath(myAbsolutePth));

const fromRelativeToAbsolutePath = (route) => path.resolve(route)
console.log(fromRelativeToAbsolutePath('./pruebas/prueba.md'));

const extensionPath = (route) => path.extname(route);
console.log(extensionPath('./pruebas/prueba.md'));

const readFile = (route) => fs.readFileSync(route, 'utf-8');

const findLinks = (route) => {
    const matcher = /\[(.*?)\]\(.*?\)/gm;
    let groupOfLinks = [];
    
    const linksInFile = readFile(route).match(matcher).filter((link) => link.includes('http'));
    linksInFile.forEach((elem) => {
        const parentheses = /\(([^)]+)\)/;
        const matchHttp = parentheses.exec(elem);
        const href = matchHttp[1];
        const text = elem.slice(1, elem.indexOf(']'));
        const file = route;
        
        const link = { href, text, file };
        groupOfLinks.push(link);
        // console.log(link,'objeto');
    })
    // console.log(groupOfLinks,'array');
    return groupOfLinks;
}    
console.log(findLinks('./pruebas/readmePrueba.md'), 'ultimo');

module.exports = {
    existPath,
    checkAbsolutePath,
    fromRelativeToAbsolutePath,
    readFile,
    findLinks,
}