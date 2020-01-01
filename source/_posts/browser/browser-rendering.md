---
title: Browser Rendering
date: 2019-11-24 14:47:53
categories: browser
tags:
---

<img src="HTML-to-Render-Tree-to-Final.png" />
<!-- more -->

## 从 HTML 原始字节到 DOM

Bytes => Charaters => Tokens => Node => DOM
+ what is `token`?
  - Essentially, an html file is broken down into small units of parsing called tokens.This is how the browser begins to understand whate you've written.

+ `node` is a separate entity within the document object tree

+ The `DOM` establishes the parent-child relationships, adjacent sibling relationships etc.

HTML 文档：
```html
<!doctype html>
<html lang="en">
 <head></head>
 <body>
    <ul class="list">
        <li class="list__item">List item</li>
    </ul>
  </body>
</html>
```
=> DOM 树

- html 
  - header `lang="en"`
  - body
    - ul `class="list"`
      - li `class="list_item"`
        - "List item"

注意：
+ DOM 与源 HTML 文档中的不同之处
  - DOM 是有效 HTML 文档的接口。例如，当源 HTML 文档中的内容为`<html>Hello World</html>`的时候，浏览器会自动更正一些无效的HTML代码。结果会在 DOM 树中会找到`head`和`body`节点 

  - DOM 可以被 js 代码修改，例如在 js 代码中添加或修改节点都会影响到 DOM 

+ 因为 DOM 是从源 HTML 文档中构建来的，不包括加在它身上的样式。所以 DOM 中不包含伪元素(例如，::after)。这也 js 无法定位到伪元素的原因。

## 从 CSS 原始字节到 CSSOM
浏览器是从 `html` 开始解析的，当发现 `link` 标签时，会开辟一个线程去发起请求取css文件数据。DOM 的构建仍会继续

生成 CSSOM 的过程与 DOM 一样  
Bytes => Charaters => Tokens => Nodes => CSSOM

css 有时叫做 Cascade 是因为浏览器会迭代遍历 css 树结构来确定影响某个元素的样式（子元素的样式会受其父元素样式的影响）

## The render tree
DOM 和 CSSOM 是两个独立的树形结构，DOM 包含有关页面HTML元素关系的所有信息，而 CSSOM 包含有关元素的样式信息。把 DOM 和 CSSOM 结合在一起就是 Render Tree

Render Tree 包含页面上所有可见 DOM 内容的信息，以及不同节点所需的所有 CSSOM 信息。  
注意：`dispaly: none` 的元素不存在 Render Tree 中，但存在 DOM 中

## Lay'em Out and Paint
浏览器根据浏览器视窗计算每个元素的具体大小和位置，这个步骤考虑到从 DOM 和
CSSOM 接收到的内容和样式，并完成所有必要的布局计算，这个过程也叫做回流(reflow)

最后一步，就是把节点绘制到屏幕上

## JavaScript

+ 当解析器遇到 `script` 标签时，DOM 的构建会被停止，直到 script 代码执行完毕。当放到头部的 js 代码涉及到 DOM 操作时就会失败，这是因为body 标签及其内容还没有被解析到。这也是为什么 script 标签放到 body 标签底部的原因。

+ 那么当解析到 script 标签，CSSOM 还没有准备好会怎样呢？
  - The javascript execution will be halted until the CSSOM is ready.
  - With the CSSOM, the JS execution waits. No CSSOM, no JS execution.

## async 属性
把 `async` 关键字添加到 `script` 标签, 其作用是：DOM 的构建不会停止，script 下载完成后执行
```html
<script src="https://some-link-to-app.js" async></script>
```

## 总结
1. DOM: Document Object Model, 浏览器将HTML解析成的树形数据结构。    

2. CSSOM: CSS Object Model, 浏览器将CSS解析成的树形数据结构。   

3. Render Tree: DOM 和 CSSOM 合并生成的Render Tree。

4. Layout: 计算出 Render Tree 每个节点的具体位置。

5. Painting: 通过显卡，将 Layout 后的节点内容分别呈现到屏幕上。

## 注意事项
+ 当我们浏览器获得HTML文件后，会自上而下的加载，并在加载过程中进行解析和渲染。

+ 加载说的就是获取资源文件的过程，如果在加载过程中遇到外部CSS文件和图片，浏览器会另外发送一个请求，去获取CSS文件和相应的图片，这个请求是异步的，并不会影响HTML文件的加载。

+ 但是如果遇到Javascript文件，HTML文件会挂起渲染的进程，等待JavaScript文件加载完毕后，再继续进行渲染。  
为什么HTML需要等待JavaScript呢？因为JavaScript可能会修改DOM，导致后续HTML资源白白加载，所以HTML必须等待JavaScript文件加载完毕后，再继续渲染，这也就是为什么JavaScript文件在写在底部body标签前的原因。

## DOM的重绘(Repaint)与回流(Reflow)
+ 重绘：元素样式的改变（但宽度、大小、位置等不变）

+ 回流：元素的大小或者位置发生了变化（当页面布局和几何信息发生变化时），触发了重新布局导致渲染树重新计算布局和渲染，还有，因为回流是根据视口的大小来计算元素的位置和大小的，所以浏览器的窗口尺寸变化也会引发回流  

注意：回流一定会触发重绘，而重绘不一定会回流

参考：  
[understanding-the-critical-rendering-path](https://bitsofco.de/understanding-the-critical-rendering-path/)  

[how-browser-rendering-works-behind-the-scenes](https://blog.logrocket.com/how-browser-rendering-works-behind-the-scenes-6782b0e8fb10/)

https://www.jianshu.com/p/05eb1b17b298    
https://youtu.be/SmE4OwHztCc 
