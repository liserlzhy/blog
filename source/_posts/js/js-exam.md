---
title: js试题 
date: 2019-9-18 20:19:53
categories: js
---
## 性能测试
`console.profile()` 在火狐浏览器中安装 `FireBug` 可以更精确的获取到程序每一个步骤所消耗的时间  

`console.time()` 也可以测试一段程序执行的时间，使用的比较多
```js
console.time('A')
// 测试程序
console.timeEnd('A')
```
## call 和 apply 的区别
`fn.call(obj, 1, 2, 3)`  
`fn.apply(obj, [1, 2, 3])`  
1. `call`，`apply` 都是 `function` 原型链上的函数，都可改变该函数内的 `this` 指针的指向
2. 传参的形式不同，`call` 是一个一个来传，而 `apply` 是以数组的形式来传
3. `call` 在性能上比 `apply` 好，特别是参数 大于 3 的情况下
4. 它们与 `bind` 的区别是，`bind` 只改变 `this` 指针的指向，而不立刻执行
<!-- more -->

## 实现 (5).add(3).minus(2)
* 把 `add()` 和 `minus()` 函数挂载到 Number 的原型链上
* 同时，每个方法执行完，都要返回 Number 这个类的实例，这样才可以链式调用
```js
~ function() {
    function check(n) {
        n = Number(n)
        return isNaN(n) ? 0 : n
    }
    
    function add(n) {
        n = check(n)
        return this + n
    }

    function minus(n) {
        n = check(n)
        return this - n
    }

    Number.prototype.add = add
    Number.prototype.minus = minus
    // 懒人写法
    // ["add", "minus"].forEach(item => {
    //     Number.prototype[item] = eval(item)
    // })
}()
```

## 箭头函数 与 普通函数的区别？
1. 语法上，箭头函数比普通函数更加简洁 
2. 箭头函数没有自己的 `this`，它里面出现的 `this` 继承函数所处上下文的 `this` （使用 `call/apply` 方式都无法改变 `this` 的指向）
3. 箭头函数中没有 `arguments` (类数组), 只能基于 ...arg 获取传递参数集合（数组）
4. 箭头函数不能被 new 执行，（因为：箭头函数没有 this 也没有 prototype）

```js
document.body.onclick = () => {
    // THIS: WINDOW
}
document.body.onclick = function() {
    // THIS: BODY
    arr.sort(function(a, b) {
        // THIS: WINDOW 回调函数的 THIS 一般都是 WINDOW
        return a - b
    })

    arr.sort(() => {
        //  THIS: BODY
    })
}
// 回调函数：把一个函数作为实参传递给另一个函数
```

## 如何把一个字符串中的大小写取反？
```js
let str = "My GOODword"
str = str.replace(/[a-zA-Z]/g, content => {
    // 两种方法
    // 1. content.toUpperCase() === content
    // 2. content.cahrCodeAt() >= 65 && content.charCodeAt() <= 90>

    return content.toUpperCase() === content ? content.toLowerCase() : content.toUpperCase()

})
```

## 实现一个字符串匹配算法，类似于 indexOf
```js
~ function () {
    // 第一种方法
    function myIndexOf(T) {
        let lenT = T.length,
            lenS = this.length,
            res = -1
        if (lenT > lenS) {
            return -1
        }
        for (let i = 0; i <= lenS - lenT; i++) {
            let char = this[i]
            if (this.substr(i, lenT) === T) {
                res = i
                break
            }
        }
        return res
    }

    // 第二种方法
    function myIndexOf(T) {
        let reg = new RegExp(T), 
            res = reg.exec(this)
        return res === null ? -1 : res.index
    }
    String.prototype.myIndexOf = myIndexOf
}()

let S = "sdlfldping",
    T = "pin"
console.log(S.myIndexOf(T))
```

## 输出下面代码运行结果
```js
// example 1
var a = {}, b = '123', c = 123
a[b] = 'b'
a[c] = 'c'
console.log(a[b]) //=> c 因为: a["123"] <=> a[123]

// example 2
var a = {}, b = Symbol('123'), c = Symbol('123')
a[b] = 'b'
a[c] = 'c'
console.log(a[b]) //=> b ，Symbol是 ES6 中新增的数据类型，它创建出来的值是唯一值，Symbol('123') === Symbol('123') 为 false

// example 3
var a = {}, b = {key: '123'}, c = {key: '456'}
a[b] = 'b'
a[c] = 'c'
console.log(a[b]) //=> c
// 1. 对象的属性名不能是一个对象（遇到对象属性名，会默认转换为字符串）
// obj={} arr=[12,23] obj[arr]='hello' obj=>{'12,23':'hello'}
// 2. 普通对象.toString() 调取的是 Object.prototype 上的方法（这个方法是用来检测数据类型的）
// obj={} obj.toString()=>"[object Object]"
```
## 验证是否符合 URL 网址格式

1. 协议：http/https/ftp
2. 域名：www.xxx.xx、xxx.xx、kbs.sports.qq.com.cn
3. 请求路径:  
    /  
    /index.html  
    /stu/index.html  
    /stu/
4. 问号传参：?xx=xx&xx=xx
5. 哈希值：#xx

```js
let str = "http://www.baidu.com/index.html?lx=1&from=we#vieo"  
let reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i // ?: 只匹配不捕获
console.log(reg.exec(str))
```
## 对象问题
```js
function Foo() {
    Foo.a = function () {
        console.log(1)
    }
    this.a = function () {
        console.log(2)
    }
}
// 把Foo当作类，在原型上设置实例公有的属性 => 实例.a()
Foo.prototype.a = function () {
    console.log(3)
}
// 把Foo当作普通对象设置私有的属性方法 => Foo.a()
Foo.a = function () {
    console.log(4)
}
Foo.a() //=>4
let obj = new Foo() // Foo.a:f=>1 obj.a:f=>2
obj.a() //=>2
Foo.a() //=>1 
```
## 编写代码实现图片的懒加载
+ 前端性能优化的重要方案，
    - 通过图片或者数据的延迟加载，可以加快页面渲染速度，让第一次打开页面的速度变快
    - 只有滑动到某个区域，我们才加载真实的图片，这样也可以节省加载的流量
+ 处理方案
    - 把所有需要延迟加载的图片用一个盒子包起来，设置宽高和默认占位符
    - 开始让所有的 IMG 的 SRC 为空，把真实图片的地址放到 IMG 的自定义属性上，让 IMG 隐藏
    - 等到所有其它资源都加载完成后，再开始加载图片
    - 对于很多图片，需要当页面滚动的时候，当前图片区域完全显示出来后再加载真实图片
    - ...

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>图片的延迟加载</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .container {
            margin: 0 auto;
            width: 800px;
        }

        .imgBox {
            margin-bottom: 20px;
            height: 450px;
            overflow: hidden;
            background: #bbb;
        }

        .imgBox img {
            display: none;
            width: 100%;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="imgBox">
            <img src="" alt="" data-img="./img/wallhaven-367257.jpg">
        </div>
    </div>
    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/delayimgs.js"></script>
</body>

</html>
```

```js
let $container = $('.container'),
    $imgBoxs = null,
    $window = $(window)

// 创建长度为 20 的数组，每一项用 null 填充
let str = ``
new Array(20).fill(null).forEach(item => { // fill() 是 es6的语法
    str += `<div class="imgBox">
            <img src="" alt="" data-img="./img/wallhaven-367257.jpg">
            </div>`
})

$container.html(str)
$imgBoxs = $container.children('.imgBox')

// 多张图片延迟加载
$window.on('load scroll', function () {
    // 获取浏览器底边框距离body的距离
    let $B = $window.outerHeight() + $window.scrollTop()

    // 循环每一个图片区域，根据自己区域距离body的距离，计算处理里面的图片是否加载
    $imgBoxs.each((index, item) => {
        let $item = $(item),
            $itemA = $item.outerHeight() + $item.offset().top, 
            isLoad = $item.attr('isLoad')
        if ($itemA <= $B && isLoad !== 'true') {
            $item.attr('isLoad', true) 
            let $img = $item.children('img')
            // 加载当前区域中的图片
            $img.attr('src', $img.attr('data-img'))
            $img.on('load', () => $img.stop().fadeIn())
        }
    })
})
```
## 正则：一个6-16位的字符串，必须同时包含有大小写字母和数字

```js
// 一个6-16位的字符串，必须同时包含有大小写字母和数字
let reg1 = /(?!^[a-zA-Z]+$)(?!^[a-z0-9]+$)(?!^[A-Z0-9]+$)(?!^[0-9]+$)^[a-zA-Z0-9]{6,16}$/

// 一个1-10为以数字字母下划线组成的字符串，必须包含下划线
let reg2 = /(?=.*_.*)^\w{1,10}$/
```

## 正向预查和负向预查
### 正向预查 (?=pattern)
所谓正向预查，就是要匹配的字符串，必须满足pattern这个条件，我们知道正则表达式/cainiao/会匹配cainiao。同样也会匹配cainiao9中的cainiao。但是我们可能希望，cainiao只能匹配cainiao8中的cainiao。这个时候就可以这样小写：`/cainiao(?=8)/`，看两个实例：

```js
var reg = /cainiao(?=8)/
var str = 'cainiao9'
alert(reg.exec(str)) //=> null

var reg = /cainiao(?=8)/
var str = 'cainiao8'
alert(reg.exec(str)) //=> cainiao
// 注意：括号里的内容只是条件，并不参与真正的捕获，只是检查后面的字符是否符合要求而已
```

### 负向预查 (?!pattern)
和(?=pattern)相反，做匹配时，必须不满足pattern这个条件，还拿上面的例子：

```js
var reg = /cainiao(?!8)/
var str = 'cainiao8'
alert(reg.exec(str)) //=> null，后面不能紧跟8

var reg = /cainiao(?!8)/
var str = 'cainiao9'
alert(reg.exec(str)) //=> cainiao
```

下面的两个表达式，表示的是一个意思  
`var reg1 = /(?=^)\d{2}(?=$)/`  
`var reg2 = /^\d{2}$/`

## $attr(prop,val) 属性选择器

```js
// 获取页面中所有class为box的元素
let arr = $attr('class', 'box')

function $attr(prop, val) {
    // 获取当前页面中所有的标签 
    let elements = document.getElementsByTagName('*'),
        arr = []
    // [].forEach.call(elements, item => {})
    elements = Array.from(elements) // 把非数组转换为数组
    elements.forEach(item => {
        // 存储的是当前元素prop对应的属性值
        let itemValue = item.getAttribute(prop)
        if (prop === 'class') { // 属性为class的进行特殊处理
            new RegExp("\\b" + val + "\\b").test(itemValue) ? arr.push(item) : null
            return 
        }
        if (itemValue === val) {
            arr.push(item)
        }
    })
    return arr
}
```

## 英文字母汉字组成的字符串，用正则给英文单词前后加空格

```js
let str = 'no做no带'
let reg = /\b[a-z]+\b/ig
str = str.replace(reg, value => {
    return " "+ value +" "
}).trim()
```

## [编写一个程序，将数组扁平化，并去除其中重复部分数据，并得到一个升序且不重复的数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

```js
let arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8 9, [11, 12, [12, 13, [14]]]], 10]

// 方法1: Array.prototype.flat 展开
// [...new Set(arr)] new Set()去重
let arr1 = Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a-b)

// 方法2： 数组不管多少级，toString之后都会变成以逗号分隔的字符串
let arr2 = arr.toString().split(',').map(item => Number(item))

// 方法3：JSON.stringify 也可以扁平化数组
let arr3 = JSON.stringify(arr).replace(/\[|\]/g, '').split(',').map(item => Number(item))

// 方法4：基于数组的some方法进行检测
let arr4 = [...arr]
while (arr4.some(item => Array.isArray(item))) {
    arr4 = [].concat(...arr4)
}

// 方法5：递归处理
~ function() {
    function myFlat() {
        let result = [],
            _this = this
        let fn = (arr) => {
            for (let i = 0; i< arr.length; i++) {
                let item = arr[i]
                if (Array.isArray(item)) {
                    fn(item)
                    continue
                }
                result.push(item)
            }
        }
        fn(_this)
    }

    Array.prototype.myFlat = myFlat
}()
let arr5 = arr.myFlat() 
```

## 实现一个_new方法，模拟内置new
分析  
`let dah = new Dog('大黄')`  
1. 像普通函数执行一样，形成一个私有的作用域
    - 形参赋值
    - 变量提升
2. 默认创建一个对象，让函数中的this执行这个对象，这个对象就是当前类的一个实例
3. 代码执行
4. 默认把创建的对象返回

```js
function Dog(name) {
    this.name = name
}
Dog.prototype.bark = function () {
    console.log('bark ...........')
}
Dog.prototype.sayName = function () {
    console.log('hi ' + this.name)
}

// Fn --- 当前要 new 的类
// ...arg 后期给构造函数传递参数
function _new(Fn, ...arg) {
    // let obj = {}
    // obj.__proto__ = Fn.prototype
    // 上面两句可以这样写
    let obj = Object.create(Fn.prototype)
    Fn.call(obj, ...arg)
    return obj
}
let dah = _new(Dog, '大黄')
```

## 数组合并

```js
let arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let arr2 = ['A', 'B', 'D']
//=> 合并后的数组为：['A1', 'A2', 'A', 'B1' 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2']

// 方法1：若arr1是升序数组
 let mixArr1 = arr2.map(item => item + 'zz').concat(arr1).sort((a, b) => a.localeCompare(b)).map(item => item.replace('zz', ''))

// 方法2：若arr1是无序的 
arr1 = ['C1', 'C2', 'B1', 'B2', 'D1', 'D2', 'A1', 'A2']
let mixArr2 = [...arr1]
let n = 0 
for (let i = 0; i < arr2.length; i++) {
    let item2 = arr2[i]
    for (let j = 0; j < mixArr2.length; j++) {
        let item1 = mixArr2[j]
        if (item1.includes(item2)) {
            n = j
        }
    }
    mixArr2.splice(n + 1, 0, item2)
}
```

## 异步问题

```js
// 定时器是异步编程：每一轮循环设置定时器，无需等定时器触发执行，继续下一轮循环
for (var i = 0; i < 10; i++) {
    setTimeout(()=> {
        console.log(i)
    }, 1000) //=> 输出10次10
}

// 让其一秒后输出连续的 0~9 可有以下几种方法

// 方法1：let 存在块级作用域，每一次循环都会在当前作用域中形成一个私有变量i存储0~9
for (let i = 0; i < 10; i++) {
    setTimeout(()=> {
        console.log(i)
    }, 1000) 
}


// 方法2：使用闭包
for (var i = 0; i < 10; i++) {
    ~ function (i) {
        setTimeout(() => {
            console.log(i)
        }, 1000) 
    }(i)
}

// 方法3：闭包2
for (var i = 0; i < 10; i++) {
    setTimeout((i => () => console.log(i))(i), 1000)
}

// 方法4：基于 bind 的预先处理机制，在循环的时候把每次执行函数需要输出的结果，预先传递给函数
var fn = function (i) {
    console.log(i)
}
for (var i = 0; i < 10; i++) {
    setTimeout(fn.bind(null, i), 1000)
}
```

## 匿名函数
1. 本应匿名的函数如果设置了函数名，在外面还是无法调用，但是在函数里面是可以使用的  
2. 而且类似于创建常量一样，这个名字存储的值不能再被修改（非严格模式下不报错，但是不会有任何效果，严格模式下会报错）

```js
let fn = function AAA() {
    //"use strict"
    //AAA = 1000 //=> Uncaught TypeError: Assignment to constant variable.
    console.log(AAA) //=> 当前函数
}
//AAA() //=> Uncaught ReferenceError: AAA is not defined
fn()
```

看一下以下例子：

```js
var b = 10
!(function b() {
    b = 20 
    console.log(b) //=> 输出b函数
})()
console.log(b) //=> 10
```

## 比较
== 进行比较时，如果左右两边数据类型不一样，则先转换为相同的数据类型，然后再进行比较  
1. {} == {} 两个对象进行比较，比较的是堆内存的地址
2. null == undefined 相等，null === undefined 不相等
3. NaN == NaN 不相等 NaN和谁都不相等
4. [12] == '12' 对象和字符串相比，是把对象toString()转换为字符串后再进行比较
5. 剩余所有情况在进行比较时，都是转换为数字（前提数据类型不一样）  
对象转数字：先转换为字符串，然后再转换为数字  
字符串转数字：只要出现一个非数字字符，结果就是 NaN  
布尔转数字：true->1 false->0  
null转数字为0  
undefined转数字为NaN  
[12] == true => Number([12].toString()) == 1 false  
[] == false => 0 == 0 true  
[] == 1 => 0 == 1 false
true == 2 => 1 == 2 false

```js
var a = ? // 当a等于什么时，符合下面表达式
if (a == 1 && a == 2 && a == 3) {
    console.log('ok')
}

// 方法1：
// 对象和数字比较：先把对象.toString()变为字符串，然后再转换为数字
var a = {
            n: 0,
            toString(){
                return ++this.n
            }
        }
// a.toString(); 此时调取的就不再是Object.prototype.toString了

// 方法2：
var a = [1, 2, 3]
a.toString = a.shift

// 方法3：
Object.defineProperty(window, 'a', {
    get: function () {
        return this.value ? ++this.value : this.value = 1
    }
})
```

## 理解Array.prototype.push

```js
let obj = {
    2: 3,
    3: 4,
    length: 2,
    push: Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)

// 解析
Array.prototype.push = function (val) {
    this[this.length] = val
    //=> this.length 在原来的基础上加1
    return this.length
}
obj.push(1) //=> obj[length]=1 //=> obj[2]=1
obj.push(2) //=> obj[length]=2 //=> obj[3]=2
console.log(obj) //=> {2: 1, 3: 2, length: 4, push: ƒ}
``` 

## 三大经典排序  
### 冒泡排序：  
让数组中的当前项和后一项进行比较，如果当前项比后一项大，则两项交换位置

```js
let arr = [12, 1, 33, 6, 10]
function bubble([...arr]) {
    for (let j = 0; j < arr.length -1; j++) {
        for (let i = 0; i < arr.length - j; i++) {
            if (arr[i] > arr[i+1]) {
                // 交换位置
                // let temp = arr[i]
                // arr[i] = arr[i + 1]
                // arr[i + 1] = temp
                [arr[i], arr[i+1]] = [arr[i+1], arr[i]]
            }
        }
    }
}
console.log(bubble(arr))
```

### 插入排序

```js
let arr = [12, 1, 33, 6, 10]
function insert([...arr]) {
    let newArr = [arr[0]]
    for (let j = 1; j < arr.length -1; j++) {
        for (let i = newArr.length - 1; i >= 0; i--) {
            if (arr[j] > newArr[i]) {
                newArr.splice(i+1, 0, arr[j])
                break   
            }
            if (i === 0) {
                newArr.unshift(arr[j])
            }
        }
    }
    return newArr
}
cosole.log(insert(arr))
```

### 快速排序

```js
function fn
    // 不会造成栈溢出
    setTimeout(fn, 0) 
    // js 运行是基于单线程的， 如果时间设为0，代表立即插入队列，但不是立即执行，仍然要等待前面代码执行完毕
)
```

```js
let arr = [3,11,1,5,10,5,6,2]

function quick([...arr]) {
    if (arr.length <= 1) {
        return arr
    }
    let middleIndex = Math.floor(arr.length/2),
        middleValue = arr.splice(middleIndex, 1)[0],
        leftArr = [],
        rightArr = []

    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        item < middleValue ? leftArr.push(item) : rightArr.push(item)
    }

    return quick(leftArr).concat(middleValue, quick(rightArr))   
}
console.log(quick(arr))
```

## 完成如下需求
```
某公司1到12月份的销售额存在一个对象里面  
如下：{
    1: 222,
    2: 123,
    5: 777
},
请把数据处理为如下结构：[222, 123, null, null, 777, null, null, null, null, null, null, null]
```

```js
let obj = {
    1: 222,
    2: 123,
    5: 777
}
// 方法1
function sale(obj) {
    let arr = []
    for (let i = 1; i <= 12; i++) {
        obj[i] ? arr.push(obj[i]) : null
    }
}
// 方法2
let arr = new Array(12).fill(null).map((item, index) => obj[index + 1] || null)

// 方法3 
obj.length = 13
let arr = Array.from(obj).slice(1).map(item => {
    typeof item === "undefinded" ? null : item
})

// 方法4
let arr = new Array(12).fill(null)
Object.keys(obj).forEach(item => {
    arr[item - 1] = obj[item]
})
```

## 给定两个数组，写一个方法来计算它们的交集

```js
let s1 = [1, 2, 1, 3]
let s2 = [2, 2, 4, 1]

function intersection([...s1], [...s2]) {
    let mix = []
    for (let i = s1.length - 1; i >= 0; i--) {
        for (let j = s2.length - 1; j >= 0; j--) {
            if (s1[i] === s2[j]) {
                mix.push(s1[i])
                s1.splice(i, 1)
                s2.splice(j, 1)
            }
        }
    }
    return mix
}
console.log(intersection(s1, s2))
```

## 旋转数组
给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数  
输入：[1, 2, 3, 4, 5] 和 k = 3  
输出：[3, 4, 5, 1, 2]  

```js
let arr = [1, 2, 3, 4, 5]

function rotate(k) {
    if (k <= 0 || k === this.length) return this
    if (k > this.length) k = k % this.length
    return this.slice(-k).concat(this.slice(0, this.length - k))

    // 方法2
    // return [...this.splice(this.length-k), ...this] 

    // 方法3
    // for (let i = 0; i < k; i++) {
    //     this.unshift(this.pop())
    // }
    // return this

    // 方法4
    // new Array(k).fill('').forEach(() => this.unshift(this.pop()))
    // return this
}
Array.prototype.rotate = rotate
console.log(arr.rotate(3)) //=> [ 3, 4, 5, 1, 2 ]
```

## 请实现一个 add 函数，满足以下功能

```
add(1) // 1  
add(1)(2) // 3  
add(1)(2)(3) // 6  
add(1, 2)(3) // 6  
add(1, 2, 3) // 6  
```

```js
!(function() {
    function myBind(context = window, ...outerArg) {
        let _this = this
        return function (...innerArg) {
            _this.call(context, ...outerArg.concat(innerArg))
        }
    }
    Function.prototype.myBind = myBind
})()
```