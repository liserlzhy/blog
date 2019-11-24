---
title: 原生node api笔记 
date: 2019-10-31 10:5:20
categories: node
tags: 
  - node api
---

## 产生唯一 id   
`npm i uuid -D`  
```js
const uuid = require('uuid/v4')
console.log(uuid().replace(/\-/g, '')) // 把所有的 - 去掉
```

## 获取 后缀名
```js
const path = require('path')
let ext = path.extname('xx.txt') // .txt
```

## stream
1. 减少内存占用、增强系统性能（利用率高）
2. 分3种：读取、写入、读写
    - 读取流：req、fs.createReadStream
    - 写入流：res、fs.createWriteStream
    - 读写流：zlib.createGzip
3. 把压缩文件发送到浏览器，需要设置响应头
    - res.setHeader('Content-Encoding', 'gzip')  
<!-- more -->

```js
const fs = require('fs')
const zlib = require('zlib')

let gz = zlib.createGzip()
// 读写流：压缩，加密
let rs = fs.createReadStream('www/1.html') // 读取流
let ws = fs.createWriteStream('www/2.html.gz') // 写入流

rs.pipe(gz).pipe(ws)
rs.on('error', err => {
    console.log('读取失败')
})

ws.on('error', err => {
    console.log('写入失败')
})
```
## EventEmitter 事件队列

```js
const Event = require('events').EventEmitter

let ev = new Event()
// ev监听
ev.on('blu', (a, b, c) => {
    console.log('收到了', a, b, c)
})

// ev触发
ev.emit('blu', 12, 5, 3) // 返回值为是否有对应监听
```
## DNS

```js
const dns = require('dns')
let ip = ''
dns.lookup('www.badu.com', (err, data) => {
    if (err) {
        console.log('wrong')
    } else {
        ip = data
        console.log(data) //输出百度的ip地址
    }
})

dns.lookupService(ip, 80, (err, data) => {

})
```
## OS
```js
const os = require('os')
let arr = os.cpus() // cpu 信息
let free = os.freemem() // 空闲内存
```
## Assertion 调试

```js
const assert = require('assert')
function divide(a, b) {
    assert(typeof a == 'number' && typeof b == 'number', '都得是数字')
    assert(b != 0, '分母不能为0')
    return a / b
}
console.log(divide(a, 10))
```
## Crypto 加密

```js
const crypto = requrie('crypto')
let hash = crypto.createHash('md5')
hash.update('sdl')
console.log(hash.digest('hex'))
```
## Child Process 多进程
Cluster
Process 
+ 只有系统才能完全全新创造进程
+ 一个程序可以通过复制自己创造新的进程
+ 子进程不能再创造进程
+ 主进程和子进程之间能够共享句柄(socket端口)  

```js
const cluster = require('cluster')
const os = require('os')
const process = require('process') // 进程信息
const http = require('http')

if (cluster.isMaster) { // 判断是否为主进程，若是主进程则分裂子进程
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork() 
    }
    console.log('主进程')
} else {
    http.createServer((req, res) => {
        console.log(`工作进程#${process.pid}`)
    }).listen(3000)
}
```  
