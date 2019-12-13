---
title: 移动端问题总结
tags:
---

## Sticky Hover
1、使用媒体查询4级交互媒体功能
```css
@media (hover:hover) {
    nav a:hover{
        background: yellow;
    }
}
```

缺点：一些浏览器不支持该媒体查询功能，对于一些同时具有触摸和鼠标输入功能的笔记本电脑将始终被当作触摸设备，无论用户使用哪种输入，与 `:hover` 相关的样式只能是其中的一种（不够灵活）。

2、根据用户当前的输入类型动态移除 "`can-touch`" 类

```html
<script>
 
;(function(){
    var isTouch = false //var to indicate current input type (is touch versus no touch) 
    var isTouchTimer 
    var curRootClass = '' //var indicating current document root class ("can-touch" or "")
     
    function addtouchclass(e){
        clearTimeout(isTouchTimer)
        isTouch = true
        if (curRootClass != 'can-touch'){ //add "can-touch' class if it's not already present
            curRootClass = 'can-touch'
            document.documentElement.classList.add(curRootClass)
        }
        isTouchTimer = setTimeout(function(){isTouch = false}, 500) //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
    }
     
    function removetouchclass(e){
        if (!isTouch && curRootClass == 'can-touch'){ //remove 'can-touch' class if not triggered by a touch event and class is present
            isTouch = false
            curRootClass = ''
            document.documentElement.classList.remove('can-touch')
        }
    }
     
    document.addEventListener('touchstart', addtouchclass, false) //this event only gets called when input type is touch
    document.addEventListener('mouseover', removetouchclass, false) //this event gets called when input type is everything from touch to mouse/ trackpad
})();
 
</script>
``` 

当用户使用的输入模式不是触摸模式时，仅"`mouseover`" 事件会被触发。对于混合设备(触摸和鼠标), 两个事件都会被触发，并且"`touchstart`" 事件触发在前。为了防止在同一触摸操作期间也调用 `"removetouchclass"` 函数以及要撤销刚完成的操作，"`touchstart`" 会在 500ms 才设置 'isTouch = false' 来移除 "`can-touch`"的样式。

参考：[4 novel ways to deal with sticky :hover effects on mobile devices](http://javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml)


## 隐藏滑动条同时内容可滑动
1、主流浏览器可支持（Chrome, Firefox, Internet Explorer, Safari, etc.）

```css
.container {
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.container::-webkit-scrollbar { /* Webkit */
    width: 0;
    height: 0;
}
```

2、可工作在所有浏览器

HTML:

```html
<div class="parent">
  <div class="child">
    Your content.
  </div>
</div>
```

CSS:

```css
.parent {
  width: 400px;
  height: 200px;
  border: 1px solid #AAA;
  overflow: hidden;
}

.child {
  height: 100%;
  margin-right: -50px; /* Maximum width of scrollbar */
  padding-right: 50px; /* Maximum width of scrollbar */
  overflow-y: scroll;
}
```

参考：[Hide scroll bar, but while still being able to scroll](https://stackoverflow.com/questions/16670931/hide-scroll-bar-but-while-still-being-able-to-scroll)

## -webkit 
WebKit 指的是使用 Webkit 内核的浏览器(Safari、Chrome、iPhone、iPad、Android等)

1、 `-webkit-tap-highlight-color`

这个属性只用于 (iPhone和iPad)。当你点击一个链接或者通过 Javascript 定义的可点击元素时，会出现一个不透明的灰色背景。禁用点击高亮可把其改为透明色。

```css
a {
  -webkit-tab-hightlight-color: rgba(0,0,0,0)
}
```

2、 `-webkit-appearance: none`

取消输入框的原生外观，在 IOS 上加入这个属性才能给按钮和输入框自定义样式。

3、`-webkit-user-select: none`

禁止页面文字选择，此属性不继承，一般加在 body 上规定整个 body 文字都不会自动调整。

4、 `-webkit-text-stroke`

添加文字边框，可定义其颜色和边框宽度
```css
h1 { -webkit-text-stroke: 2px red; }

// 设定 1px 的透明边框，可让文字变得平滑
h2 { -webkit-text-stroke: 1px transparent; }

// 镂空字体
h3 {
  color: transparent;
  -webkit-text-stroke: 3px red;
}
```

5、`-webkit-touch-callout:none`  

禁止长按页面时弹出菜单 (IOS有效)