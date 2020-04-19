## NodeJS 是什么

### node.js 是一个异步的事件驱动的 JavaScript 运行时。

>- JRE 是 java 运行时环境
>- C Runtime
>- .NET Common Language Runtime
>
>运行时 runtime 就是程序运行过程中，
>
>指的是指令加载到内存并由 CPU 执行的时候。
>
>运行时库就是程序运行过程中所需要依赖的库。
>
>C 代码编译成可执行文件的时候，指令没有被 CPU 执行，这个时候算是**编译时**。

### node.js 特性其实就是 JS 特性：

- 非阻塞 I/O
- 事件驱动

### node 历史 — 为性能而生

> Ryan Dahl(Google Brain)，他的工作是用 C/C++ 写高性能 Web 服务。对于高性能，异步 IO、事件驱动是基本原则，但是用 C/C++ 来写就太痛苦了。于是他开始设想用高级语言开发 Web 服务。他评估了很多种高级原因，还想很多语言虽然同时提供了同步 IO 和异步 IO，但是开发人员一旦用了同步 IO，他们就再也懒得写异步 IO，所以最终 Ryan 瞄向了 JavaScript。
>
> 因为 JavaScript 是单线程执行，根本不能进行同步 IO 操作，所以 JavaScript 的这一"缺陷"导致了它只能使用异步IO。
>
> 选定了开发语言，还要有运行时环境，V8 就是开源的 JavaScript 引擎。于是在2009，Ryan 正式推出了基于 JavaScript 语言和 V8 引擎的开源 Web 服务器项目，命名为 Node.js。Node 第一次把 JavaScript 带入到后端服务器开发。

### 并发处理的更替

- 多进程 - Linux C / Apache

  > 进程的缺陷：
  >
  > - 创建和切换的时间和空间开销较大，且随着并发进程数量的提升，时间和空间的开销会逐渐增大，从而限制了系统的并发能力。
  > - 进程间的资源共享不方便

- 多线程 - Java

- 异步 I/O - JavaScript

- 协程 - Lua / OpenResty / Go / deno (go + TS)

> deno
>
> [ https://studygolang.com/articles/13101 ]( https://studygolang.com/articles/13101 )

### 与前端中 JS 异同

- 核心语法不变
- 前端：BOM / DOM
- 后端：fs / http / buffer / event / os

## 使用

### 运行

每次修改 js 文件需重新执行才能生效，安装 nodemon 可以监视文件改动，自动重启：

```
npm i -g nodemon
```

### 调试

Debug - Start Debugging

> https://nodejs.org/en/

### 使用模块

- node 内建模块

  ```js
  // 内建模块直接引用
  const os = require('os')
  const mem = os.freemem() / os.totalmem() * 100
  console.log(`内存占用率${mem.toFixed(2)}%`)
  ```

- 第三方模块

  > [https://www.npmjs.com/](https://www.npmjs.com/)

  ```js
  // 同级 CPU 占用率，先安装
  npm i download-git-repo -S
  ```

  ```js
  // 导入并使用
  const download = require('download-git-repo')
  const ora = require('ora')
  
  const process = ora('下载中...')
  process.start()
  
  download('github:yuuFen/vuex-reimplement', '../test', (err) => {
    // console.log(err ? 'Error' : 'Success')
    if (err) {
      process.fail()
    } else {
      process.succeed()
    }
  })
  ```

- promisefy

  > 让异步任务串行化（要符合规范）

  ```js
  const repo = 'github:yuuFen/vuex-reimplement'
  const desc = '../test'
  clone(repo, desc)
  
  async function clone(repo, desc) {
    const { pormisify } = require('util')
    const download = promisify(require('download-git-repo'))
    const ora = require('ora')
    const process = ora('下载中...')
    process.start()
    try {
      await download(repo, desc)
    } catch (err) {
      process.fail()
    }
    process.succeed()
  }
  ```

- 自定义模块

  ```js
  // download.js
  // 可以作为导出对象的属性导出
  module.exports.clone = async function clone(repo, desc) {
    const { pormisify } = require('util')
    const download = promisify(require('download-git-repo'))
    const ora = require('ora')
    const process = ora('下载中...')
    process.start()
    try {
      await download(repo, desc)
    } catch (err) {
      process.fail()
    }
    process.succeed()
  }
  
  // run
  const { clone } = require('./download')
  const repo = 'github:yuuFen/vuex-reimplement'
  const desc = '../test'
  
  clone(repo, desc)
  ```

## API

### fs

```js
const fs = require('fs')

// 同步调用
const data = fs.readFileSync('./download.js')
// data 类型为 Buffer
console.log(data.toString())

// 异步
fs.readFile('./download.js', (err, data) => {
    if (err) throw err
    console.log(data.toString())
})

// fs 常搭配 path api 使用
const path = require('path')
fs.readFile(path.resolve(path.resolve(__dirname, './download.js')), (err, data) => {
    if (err) throw err
    console.log(data.toString())
})

// prromisify
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
readFile('./download.js').then(data => console.log(data))

// fs Promises API node v10
const fsp = require('fs').promises
fsp
    .readFile('./download.js')
    .then(data => console.log(data))
	.catch(err => console.log(err))
```

### Buffer

>  用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。 八位字节组成的数组，可以有效的在 JS 中存储二进制数据。

```js
// 创建一个长度为 10 字节以 0 填充的Buffer
const buf1 = Buffer.alloc(10)
console.log(buf1)

// 创建一个 Buffer 包含 ascii
const buf2 = Buffer.from('a')
console.log(buf2, buf2.toString())

// 创建 Buffer 包含 UTF-8 字节
// UFT-8：一种变长的编码方案，使用 1 ~ 6 个字节来存储
// UFT-32：一种固定长度的编码方案，不管字符编号大小，始终使用 4 个字节来存储
// UTF-16：介于 UTF-8 和 UTF-32 之间，使用 2 个或者 4 个字节来存储，长度既固定又可变
const buf3 = Buffer.from('Buffer 创建方法')
console.log(buf3)

// 写入Buffer数据
buf1.write('hello')
console.log(buf1)

// 读取Buffer数据  
console.log(buf3.toString())  

// 合并Buffer  
const buf4 = Buffer.concat([buf1, buf3])
console.log(buf4.toString());
```

### http

> 用于创建 web 服务的模块

- 创建一个http服务器

```js
const http = require('http')
const server = http.createServer((request, response) => {
    // 打印一下 response 的原型链
    console.log(getPrototypeChain(response))
    // response 是一个 Steam
    response.end('a response from server')
})

server.listen(3000)


function getPrototypeChain(obj) {
    let prototypeChain = []
    while (obj = Object.getPrototypeOf(obj)) {
        prototypeChain.push(obj)
    }
    prototypeChain.push(null)
    return prototypeChain
}
```

显示首页 / 实现接口

```js
const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
  const { url, method } = request

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
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/plain;charset=utf-8')
    response.end('404 页面不存在')
  }
})

server.listen(3000)
```

### stream

> 用于与 node 中流数据交互的接口

```js
const fs = require('fs')

const rs = fs.createReadStream('./img1.png')
const ws = fs.createWriteStream('./img2.png')
// 在内存中以字节流动，防止传输大文件时内存占用过高
rs.pipe(ws)
```

![](file://D:/Blog/post-images/1587322423228.png)

响应图片请求

```js
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
  } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
    console.log(url) // '/img.png'
	// response 是 Stream
    fs.createReadStream('.' + url).pipe(response)
  }
})

server.listen(3000)
```