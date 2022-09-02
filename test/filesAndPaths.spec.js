const fileAndPath = require('../filesAndPaths.js');

describe('existPath', () => {
    it('should verify if the path exist', () => {
        const myAbsolutePth = 'C:/Users/Carola/OneDrive/Escritorio/Laboratoria/LIM018-md-links/pruebas/prueba.md';
        expect(fileAndPath.existPath(myAbsolutePth)).toBe(true)  
    });
    it('should return false if the path does not exist', () => {
        const onePath = './prueba/prueba.md';
        expect(fileAndPath.existPath(onePath)).toBe(false)  
    })
});