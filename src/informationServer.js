const axios = require('axios');

const informationServer = (url) => new Promise((resolve, reject) =>{
    axios.get(url)
    .then((response) => {
        console.log(response.status);
        console.log(response.statusText);
        resolve(response)
    })
    .catch((err) => {
        console.log('el error', err);
        reject(err)
    })
});
informationServer('https://es.wikipedia.org/wiki/Markdown').then(console.log).catch(console.log)

module.export = informationServer;