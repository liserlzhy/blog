---
title: 移动端适配
tags:
---

## 判断是否为移动端
```js
function opinion(){
  if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    alert('移动端')
    
  }else {
    alert('pc端')
  }
}
opinion();
```

## 移动端去除css的hover

1. 去除 css 的 hover   
直接 body 添加 ontouchstart `<body ontouchstart>`

2. 去除 jq 的 hover  

```js
var screenWidth = $(window).width()
if (screeWidth <= 80) {
  $(".menu").unbind('mouseenter').unbind('mouseleave')
}
```
## 去除safari浏览器下input的默认样式

```css
-webkit-appearance: none;
```

## 去掉手机浏览器头部搜索栏和底部工具栏
苹果、QQ浏览器、UC浏览器：

```html
<!--删除苹果默认的工具栏和菜单栏，默认为no显示工具栏和菜单栏。-->
<meta name="apple-mobile-web-app-capable" content="yes"/>

<!--QQ强制全屏-->
<meta name="x5-fullscreen" content="true">

<--UC强制全屏-->
<meta name="fullscreen" content="yes">
```
