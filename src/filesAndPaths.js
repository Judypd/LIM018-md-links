const fs = require('fs')
const path = require('path')

// const myAbsolutePth = 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md'

// verificar si la ruta existe
const existPath = (route) => fs.existsSync(route)

// verificar si la ruta es absoluta y si no, convertir a absoluta
const checkAbsolutePath = (route) => path.isAbsolute(route)

const toAbsolutePath = (route) => {
  return checkAbsolutePath(route) === false ? path.resolve(route) : route
}
// console.log(toAbsolutePath('./pruebas/prueba.md'));

// verificar que archivo tenga extensión .md
const extensionPath = (route) => path.extname(route)

const readFile = (route) => fs.readFileSync(route, 'utf-8')

// extraer links presentes en archivo .md
const findLinks = (route) => {
  const matcher = /\[(.*?)\]\(.*?\)/gm
  const groupOfLinks = []

  const linksInFile = readFile(route).match(matcher).filter((link) => link.includes('http'))
  linksInFile.forEach((elem) => {
    const parentheses = /\(([^)]+)\)/
    const matchHttp = parentheses.exec(elem)
    const href = matchHttp[1]
    const text = elem.slice(1, elem.indexOf(']'))
    const file = route

    const link = { href, text, file }
    groupOfLinks.push(link)
    // console.log(link,'objeto');
  })
  // console.log(groupOfLinks);
  return groupOfLinks
}
// console.log(findLinks('./pruebas/readmePrueba.md'), 'ultimo');

module.exports = {
  existPath,
  extensionPath,
  toAbsolutePath,
  findLinks
}
