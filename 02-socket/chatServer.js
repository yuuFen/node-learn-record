// 原理：
// Net 模块提供一个异步 API，能够创建基于流的 TCP 服务器，
// 客户端与服务器建立连接后，服务器可以获得一个全双工 Socket 对象，
// 服务器可以保存 Socket 对象列表，
// 在接受某客户端消息时，推送给其他客户端。
//
// 通过 Telnet 连接服务器
// telnet localhost 9000

const net = require('net')
const chatServer = net.createServer()

const clientList = []
chatServer.on('connection', (client) => {
  client.write('Hi \n')
  clientList.push(client)
  client.on('data', (data) => {
    console.log('receive:', data.toString())
    clientList.forEach((v) => {
      v.write(data.toString)
    })
  })
})

chatServer.listen(9000)