const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
  const { url, method, headers } = request

  if (url === '/' && method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
        response.end('500 服务端错误')
      }
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/html')
      response.end(data)
    })
  } else if (url === '/users' && method === 'GET') {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ name: 'name' }))
  } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
    console.log(url)

    fs.createReadStream('.' + url).pipe(response)
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/plain;charset=utf-8')
    response.end('404 页面不存在')
  }
})

server.listen(3000)
