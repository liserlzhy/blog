---
title: vue 的核心原理
date: 2019-12-28 21:16:06
tags: Vue
---

## Object.defineProperty()
作用：直接在一个对象上定义一个新属性，或者修改一个对象现有的属性

语法：Object.defineProperty(obj, prop, descriptor)

descriptor 为被定义或修改的描述符

+ 数据描述
  - `configurable` : 是否可以被删除，默认 false
  - `enumerable` : 是否可以被枚举， 默认 false
  - `value` : 属性的值，默认为 undefined
  - `writable` : 是否可以被重写， 默认 false
+ 访问器描述
  - getter : 获取属性值得方法
  - setter: 设置属性值得方法
  - 注意：可以写 configurable, enumerable, 不能写 value, writable
<!-- more -->
```js
let obj = {}
Object.defineProperty(obj, 'title', {
  value: 'hello world', 
  enumerable: true, 
  writable: true,  
  configurable: true,  
})
```

## vue 的响应式原理

把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项， Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter，Vue 内部会对数据进行劫持操作，进而追踪依赖，在属性访问和修改时通知变化

```html
<body>
  <h1 id="title">xxxx</h1>
  <script> 
    let data = {
      title: 'hello world',
      active: true
    }

    title = document.getElementById('title')
    observer(data)
    
    btn.onclick = function () {
      data.title = 'Vue'
    }

    function observer(obj) {
      Object.keys(obj).forEach(item => {
        defineReactive(obj, item, obj[item])
      })
    }

    function defineReactive(obj, key, value) {
      Object.defineProperty(obj, key, {
        get() {
          return value
        },
        set(newValue) {
          value = newValue
          title.innerHTML = newValue
        }
      })
    }
  </script>
</body>
```

