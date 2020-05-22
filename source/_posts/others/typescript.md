---
title: TypeScript
date: 2020-01-18 16:15:39
categories: others
tags:
---

## 起步
1、安装 TypeScript 编译器

    npm i typescript -g

TypeScript 是 JavaScript 的超集，添加了可选的静态类型和基于类的面向对象编程。所以 TypeScript 代码在浏览器/Node环境下运行，需要把 TypeScript 代码编译为 JavaScript 代码

2、编译命令

    ./node_modules/bin/tsc ./src/1.ts --outDir ./dist

3、配置文件 ( tsconfig.json )

```json
{
  "compilerOptions": {
    "module": "commonjs", 
    "target": "es2017",
    "outDir": "./dist", 
    "strictNullChecks": true,
    "noImplicitThis": true 
  },
  "include": [ 
    "./src/**/*"
  ]
}
```
注释：

`compilerOtions `
  - `module`: 指定编译后的代码要使用的模块化系统，注意：只有"AMD"和"System"能和outFile一起使用
  - `target`: 指定编译后的代码对应的 ECMAScript版本
  - `outDir`: 指定编译后的代码文件输出目录
  - `outFile`: 将输出文件合并成一个文件 (合并的文件顺序为加载和依赖顺序)
  - `strictNullChecks`: 严格模式

`include`: 指定要编译的文件目录，若不指定会编译该目录下所有的TypeScript文件，可使用 glob 匹配模式，例如：* 匹配0或则多个字符，?匹配一个任意字符，**/匹配任意子目录

配置完成后，直接输入`./node_modules/bin/tsc` 它会自动编译ts文件

注意： ts-node 模块可以编译并运行TypeScript文件

## 类型系统
类型注解（类型声明、类型约束）

JavaScript 是动态语言，变量随时可以被赋予不同类型的值，变量值得类型只有在运行时才能决定

使用类型注解能够在变量声明的时候确定变量存储的值的类型，用来约束变量或参数值的类型，这样在编码阶段就可以检查出可能出现的问题，避免把错误带到执行期间

语法：

    let 变量:类型

当变量接收了与定义的类型不符的数据会导致编译失败（警告）

基本类型：string、number、boolean  
对象类型：String、Number、Boolean

注意：基本类型可以赋值给对应包装对象，包装对象不可以复制给对应基本类型

```typescript
let s:String = 'typescript'
let s:string = new String('typescript') // 该语句会报错
```
### 数组

基本语法：`let list: number[];`  
泛型方式：`let list: Array<number>;`

注意：该数组是具有相同类型的一组有序数据的集合，声明数组的同时要确定数据存储的数据类型

### 元组

```typescript
let data: [number, string, boolean];
data[0] = 1; // 一定得是number类型
data[1] = '2'; 
data[2] = false;
data[3] = 10; // number,string,boolean 随便一种类型都可以
// 注意：数据类型要对应定义的顺序， 越界部分，采用联合类型
```
### 联合类型

```typescript
let a: stirng|number; // 可存储string或number类型的数据 
```
### 交叉类型

```typescript
let b: string&number = {}
```

### 枚举
```typescript
enum Gender {mail, femail};
console.log(Gender.mail)
```

### any
任意类型

### 类型推导

```typescript
    let a = 1; // ts会根据变量初始化的时候根据赋予的值进行类型判断 

    document.onclick = function(e) { // 事件函数的第一个参数，根据当前绑定的事件类型推导(e:MouseEvent)
      
    }
```

## 函数

对函数的参数和返回值进行类型约束

```typescript
function fn1(x: number, y: number): number {
  return x + y;
}

let fn2: (x: number, y: number) => number = function(x: number, y: number): number {
  return x * y;
}
// 根据类型推断可简写为
let fn2: (x: number, y: number) => number = function(x, y) { 
  return x * y;
}
fn2(2, 3);
// 如果函数没有返回值 :void

/* 可选参数 ? */
function fn3(x: number, y?: number): void {}

/* 参数默认值 */
function fn4(x = 1): number { return x * x }

/* 剩余参数 */
function fn5(...arg: any[]) {}

/* 函数重载 */
function fn(x: number, y: number): number;
function fn(x: string, y: string): string;

function fn(x: any, y: any): any {
  return x + y;
}
```

### 函数中的 this

+ ts 中函数中的 this 默认指向类型 : any （除了事件函数）  
+ any类型不能指示任何属性方法  
+ 我们可以通过 `--nolmplicitThis` 选项来取消this的默认any类型设置
+ ts 会自动推导事件函数中的 this
+ 在ts中函数的第一个this参数是用来设置 this 类型约束的，该this参数是个假参数，运行过程中是不存在的，是给ts检测使用

```typescript
let obj1 = {
  a: 1,
  fn(this: Document|Element) {
    this.querySelecter()
  }
}
document.onclick = obj1.fn;
```

## 类

与 ES2015 的 class 类似，同时还新添了一些特性，TS 中的成员属性可以提取到构造函数以外进行定义

通过修饰符可以对类中成员属性与成员方法进行访问控制：
+ public : 公开的，所有地方都能访问，属性和方法默认是public
+ protected : 受保护的，在类的内部和他的子类中才能访问 
+ private : 私有的，只能在该对象（类）的内部才可以访问
+ readonly : 只读

存取器：getters/setters 截取对对象成员的访问

```typescript
// ts类中的成员属性必须要声明后使用
class Person {
  username: string = '';
  constructor(name: string, private age: number) {
    this.username = name;
    this.age = age;
  }

  // 存取器，属性方式去访问
  get age(): number {
    return this.age;
  }

  set age(age: number) {
    if (age > 0 && age < 150) {
      this.age = age;
    }
  }
}
let p = new Person('Tom');

```

### 继承

+ 如果子类没有重写构造函数，会直接继承父类的，否则需要手动调用父类构造函数

```typescript
class Student extends Person {
  constructor(username: string, age: number, public grade: number) {
    super(username age); // 执行父类构造函数
    this.grade = grade;
  }
}
```

### 抽象类
+ 抽象方法只定义结构不定义具体实现。
+ 拥有抽象方法的类必须是抽象类，但抽象类不一定拥有抽象方法，抽象类中也可以包含其他非抽象方法。
+ 抽象类不能被实例化。
+ 继承抽象类的类必须实现抽象类中的所有方法，否则该子类也必须声明为抽象的。

```typescript
abstract class Person {
  private _age: number;
  constructor(public username: string) {
    this.username = username
  }
  abstract study(): void;
}

class Student extends Person {
  study() {
    console.log('i am studing something new.')
  }
}

```

## 接口

+ 为我们提供一种方式来定义某种结构，ts按照这种结构来检测数据  
+ 接口中定义的规则只有抽象描述，不能有具体实现
+ 类型检查器只会检测必须的属性是否存在，以及类型是否匹配，不会检查属性的顺序
```typescript
interface Options {
  width: number,
  height: number, // 比选属性
  color?: string, // 可选属性
  // readonly name: string // 只读属性
}

function fn(opts: Options) {

}

/* 绕开类型检测 */

// 告知ts检测，传入的就是一个 Options
fn({ height: 200 } as Options) 

// 先赋值给一个变量，也可以绕开检测
let obj = { height: 100, width: 20, color: 'red', a: 1}
fn(obj)

// 索引签名：希望规则是一组由数字进行key命名的对象
// 索引key类型只能是string或number， string 也支持number key
interface Options2 {
  [attr: number]: any
}

// 函数接口
interface IFn {
  (x: number, y: number): number
}
```

### 类接口

+ 继承接口的类必须拥有接口定义的属性和方法
+ 一个类只能继承一个类，但是可以实现多个接口
+ 接口之间也可以继承

```typescript
interface ISuper {
  fly(): void;
}
class Man{
  constructor(pubic name: string) {

  }
}
class SuperMan  extends Man implements ISuper{
  fly() {
    console.log('i can fly')
  }
}
```

## 泛型

通常我们会使用变量来表示是一个可变的值，通过变量我们就可以使代码具有很高的可重用性，但是在有类型约束的语言中，有时候不利于代码的复用，通过使用泛型，我们就可以解决这个问题，简单的理解可以说是给类型定义变量

```typescript

function fn<T>(x: T[]): T[]{
  return x;
}

fn<string>(['s', '1'])
class MyArray <T> {
  private _data: T[] = [];

}

// 类类型 {new()}
function _(constructor: {new(): Array<string>}) {
  return new constructor()
}
```

## 装饰器

在尽可能不改变类（对象）结构的情况下，扩展其功能。装饰器是一种特殊类型的声明，它可以被附加到类声明、属性、方法、参数或访问符上。

启动装饰器模式：--experimentalDecorators

装饰器函数：  
我们要在一个类或方法上使用装饰器，首先需要提供一个装饰器函数，这个函数会在该装饰器被使用的时候调用

1、类装饰器：  
类装饰器应用于构造函数，可以用来监视、修改或替换类定义，类的构造函数会作为类装饰器函数的唯一一个参数

    function f(constructor: Function) {}

```typescript
function Age(v: number) {
  return function<T extends {new(...args: any[]): {}}>(constructor: T): T {
    class Person2 extends constructor {
      age: number = v;
    }
    return Person2;
  }
}
  

// Age是一个装饰器函数，该函数会自动调用。调用的时候会传入对应类的构造函数
// 如果希望转入构造值，就得使用闭包
@Age(20)
class Person {
  username = 'Tom';
}

let p = new Person();
console.log(p); // Person2 {username: 'Tom', age: 20 }
```
2、方法装饰器：  
用来监视、修改或替换方法定义，方法装饰器会在调用时传入下列三个参数
+ 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
+ 成员的名称
+ 成员属性描述符

3、访问器装饰器  
访问器：get、set，访问器装饰器会在调用时传入下列3个参数：

+ 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
+ 成员的名称
+ 成员属性描述符

注意：不允许同时修饰一个成员的get和set服务器。一个成员的所有装饰必须应用在文档顺序的第一个访问器上

4、参数装饰器
参数装饰器声明在一个参数声明之前，参数装饰器只能用来监视一个方法的参数是否被传入
```typescript

```
```typescript
let input: HTMLInputElement = document.querySelector('.val');
let btn: HTMLButtonElement = documentSelector('button');

btn.onclick = function() {
  let value: number = Number(input.value) + 10;
}
```
