const axios = require('axios')

const infoServer = (url) => new Promise((resolve, reject) => {
  axios.get(url)
    .then((response) => {
      resolve(response)
    })
    .catch((err) => {
      console.log('el error', err)
      reject(err)
    })
})
infoServer('https://es.wikipedia.org/wiki/Markdown').then(console.log).catch(console.log)

module.export = infoServer
