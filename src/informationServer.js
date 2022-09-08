const axios = require('axios');

const infoServer = (url) => new Promise((resolve, reject) => {
  axios.get(url)
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
});
infoServer('https://es.wikipedia.org/wiki/Markdown').then((res) => console.log('petición HTTP', res.status, res.statusText)).catch(console.log)

module.exports = infoServer;
