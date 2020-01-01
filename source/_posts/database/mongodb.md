---
title: mongodb
date: 2019-12-22 23:28:48
categories: database
tags:
---

启动数据库服务

    mongod

开启mongo客户端  

    mongo --dbpath=C:/data
<!-- more -->
## 数据库操作
### 查询
1、查看有哪些数据库

    show dbs

2、 使用/创建数据库(需要插入数据，数据库才会创建成功)

    use dbname

3、 插入数据到表user

    db.user.insert({'name': 'zhy', 'age': 12})

4、 查看有哪些表

    show collections

5、 查询表中所有记录

    db.user.find()

6、 查询 age = 12 的记录

    db.user.find({'age': 12})

7、 查询 age > 12 的数据 (`$lt` &lt;, `$gte` &gt;=, `$lte` &lt;=, )

    db.user.find({'age': {$gt:12})

8、 模糊查询

    db.article.find({'title': /文章/})

9、 查询指定列

    db.user.find({}, {name:1,age:1})

10、 排序(-1 降序)

    db.user.find({}).sort('age':-1)

11、 查询前5条数据

    db.user.find({}).limit(5)

12、 查询3-6的数据

    db.user.find().skip(2).limit(3)

13、 $or 

    db.user.find({$or: [{'age':20}, {'age':24}]})

14、 查询第一条数据

    db.user.findOne()

15、 统计

    db.user.find().count()

16、 如果要查询限制之后的记录数量，要使用count(true)

    db.user.find().skip(10).limit(5).count(true)

### 删除/修改
1、 删除集合(里面没有集合，数据库也会自动删除)

    db.user.drop()

2、 删除数据库

    use dbname
    db.dropDatabase()

3、 修改数据

    db.user.update({name:'zhy'}, {$set:{name: 'Tom', age: 24}})

4、 替代那一条数据
    db.user.update({name:'zhy'}, {'replace':true})

5、 删除某条数据

    db.user.remove({name: 'zhy'})

6、 只删除一条数据

    db.user.remove({age: 12}, {justOne: true})

### 索引

1、 设置索引(设置索引可以提高查询速度) 1表示升序索引 -1表示降序

    db.user.ensureIndex({name: 1})

2、 查看索引

    db.user.getIndexes()

3、 删除索引

    db.user.dropIndex({name: 1})

4、 查询具体的执行时间

    db.user.find().explain('executionStats')

5、 复合索引

    db.user.ensureIndex({name: 1, age: -1})

基于name 和 age 或者基于name 的查询会用到该索引，但是基于age的不会

6、 唯一索引(值只能是唯一的)

    db.user.ensureIndex({name: 1}, {unique: true})

## 在 node 中的使用 mongodb

引包：

    npm install mongodb --save

```js
const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://127.0.0.1:27017'
const dbName = 'test' 

class Db {
  constructor () {
    this.db = null
    this.connect()
  }

  connect () {
    return new Promise((resolve, reject) => {
      if (!this.db) { 
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
          if (err) {
            reject(err)
          } else {
            this.db = client.db(dbName) 
            console.log('connect')
            resolve(this.db)
          }
        })
      } else {
        resolve(this.db)
      }
    })
  }

  find (table, json) {
    console.log('find')
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(table).find(json).toArray((err, docs) => {
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
      })
    })
  }
}

module.exports = new Db()
```

## 在 node 中使用 mongoose

mongoose 是在 nodejs 异步环境下对 mongondb 进行便捷操作的对象模型工具。它是 nodejs 的驱动，不能作为其他语言的驱动。

特点：
+ 通过关系型数据库的思想来设置非关系型数据库
+ 基于 mongodb 驱动，简化操作

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 1、连接数据库
mongoose.connect('mongondb://127.0.0.1:27017/test', { useNewUrlParser: true})
.then(() => {
  console.log('mongodb connecting ...')
})
.catch(err => {
  console.log(err)
})

// 2、实例化数据模板
const UserSchema = new Schema({
    name: {
        type: String,
        required: true, // 表示必须传入这个数据
        unique: true // 唯一索引 (而 index: true  为普通索引)
    },
    password: String, // 或者 password: 'string' 都可以
    date: {
        type: Date,
        default: Date.now, // 默认值
    }
})

// 3、定义数据模型
// 这个模型会和模型名称相同的复数的数据库表建立连接， 第一个参数首字母大写
let User = mongoose.model("User", UserSchema) // 关联的是users表
// let User = mongoose.model('User', UserSchema, 'user') // 关联的是user表

// 查找数据
User.find({}, (err, doc) => {})

// 增加数据
let us = new User({
  name: 'Tom',
  email: 'xxx'
})
// 或者 us.name = 'Tom'
us.save(err => {})


// 更新数据
User.updateOne({'_id': '5d42933e6258d24ddca1fdd3'}, {'name': 'Jane'}, (err, doc) => {})

// 删除数据
User.deleteOne({'_id': '5d42933e6258d24ddca1fdd3'}, (err, doc) => {})
module.exports = router.routes()
```
### mongoose 预定义模式修饰符

lowercase uppercase trim

```js
const Schema = require('mongoose').Schema
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true // 清除两边空格
    }
})
```

### Mongose Geters 与 Setters 自定义修饰符
除了 mongoose 内置的修饰符以外，我们还可以通过 set （建议使用）， 也可以通过 get （不建议使用）
修饰符在增加数据的时候对数据进行格式化

```js
const UserSchema = new Schema({
    redirect: {
    type: String,
    set (params) {
      // params 可获取 redirect 的值
      if (!params) {
        return ''
      } else {
        if (params.indexOf('http://') && params.indexOf('https://') != 0) {
          return 'http://' + params
        }
        return params
      }
    }
  }
})
```
### 扩展内置方法

```js
// 扩展静态方法 (访问方式：UserSchema.findByName())

UserSchema.statics.findByName = function (name, callback) {
  this.find({'name': name}, function(err, docs) {
    callback(err, docs)
  })
}

// 扩展实例方法 (访问方式：let user = new UserModel(); user.print())

UserSchema.methods.print =  function () {
  console.log(this.name)
}
```

### 数据校验

+ required: 表示这个数据必须传入 （任意类型）
+ max: 用于 Number 类型数据， 最大值
+ min: 用于 Number 类型数据， 最小值
+ enum: 枚举类型，要求数据必须满足枚举值 enum: ['Mon', 'Tus'], (String) 
+ match: 增加的数据必须符合 match (正则) 的规则 （ match: /^z(.*)/ ），(String)
+ maxlength: 最大长度，(String)
+ minlength: 最小长度, (String)

```js
name: {
    type: String,
    validate(param) { // 自定义验证器
        return param.length >= 6
    }
}
```

### 聚合管道

```js
OrderModel.aggregate([
    {
        $lookup: {
            from: 'order_item', // order表关联order_item表 
            localField: 'order_id', // order表中的 order_id
            foreignField: 'order_id', // foreignField表中的 order_id
            as: 'items' // 放到 items 字段中
        },
        {
            $match: {'all_price': {$gte: 90}} // 查询条件
            // $match: {'_id': mongoose.Types.ObjectId('5d42938d6258d24ddca1fdd4')}
        }
    }
], (err, docs) => {})
```


```js
let ArticleSchema = new Schema({
    title: { type: String, unique: true },
    cid: { type: Schema.Types.ObjectId },
    author_id: { type: Schema.Types.ObjectId },
    author_name: { type: String},
    description: String,
    order: {type: Number, default: 100},
    content: String
})

let ArticleCateSchema = new Schema({
    title: { type: String, unique: true },
    description: String,
    addtime: { type: Date }
})

let UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    name: String,
    age: Number,
    sex: String,
    tel: Number,
    status: { type: Number, default: 1}
})

ArticleModel.aggregate([
    {
        $lookup: {
            from: 'articlecate',
            localField: 'cid',
            foreignField: '_id',
            as: 'cate'
        }
    },
    {
        {
        $lookup: {
            from: 'articlecate',
            localField: 'author_id',
            foreignField: '_id',
            as: 'user'
        }
    }
    }
], (err, docs) => {

})
```