---
title: mysql
date: 2019-12-30 09:01:16
categories: database
tags:
---

## 存储引擎

存储引擎：数据在计算机上存储的方式

MySQL 常见的存储引擎：InnoDB、MyISAM等
  - InnoDB 的优势在于提供了良好的事务处理、崩溃修复能力和并发控制。缺点是读写效率较差，占用的数据空间相对较大

  - MyISAM 的优势在于占用空间小，处理速度快。缺点是不支持事务的完整性和并发性

## 数据库

### 字符集、编码

  - 指数据库存储的数据的编码
  - utf8mb4 : 支持更多的 unicode 字符（四字节）
  - _bin、_cs : 区分大小写
  - _ci : 不区分大小写

### 数据校对

  - 数据库除了要存储数据，还要对数据进行排序，比较等操作，不同的校对规则会有不同的结果

  - utf8mb4_unicode_ci : 基于标准的 Unicode 来排序和比较，能够在各种语言和之间精确排序

### 数据类型

数字类型

|类型|存储 (字节)|
|:--|:--|
|TINYINT|1|
|SMALLINT|2|
|MEDIUMINT|3|
|INT|4|
|BIGINT|8|

字符串类型

|类型|存储 (字节)|描述|
|:--|:--|:--|
|char(n)|n|定长字节：指定多少字节就为多少字节，(n为数字，范围：0-255)|
|varchar(n)|n|不定长字节：长度跟存储的数据相匹配，最大n字节。(n为数字，范围：0-255)|

### 主键 (PRIMARY KEY)

表中的一个或多个字段，它的值用于唯一地标识表中的某一条记录，用来保持数据的完整性

特定：
+ 一个表中只能有一个主键
+ 主键可以是一个字段，也可以由多个字段组成
+ 主键值不能重复
+ 可加快对数据的操作

### 索引 (INDEX)
对表中一列或者多列的值进行排序的一种结构，使用索引可以加快访问表中特定的信息，加快对表中记录的查找或排序

## 命令语句

连接数据库

    -- 可使用 --host 参数连接外部数据库
    mysql -uroot -p 

授权

```sql
-- 运行外部主机连接到mysql服务器，需要授权
grant all privileges on 库名.表名 to '用户名'@'IP地址' identified by '密码' with grant option;
flush privileges;
```

创建数据库

```sql
CREATE DATABASE 数据库名称 DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_bin;
```

删除数据库

```sql
DROP DATABASE 数据库名称;
```

创建表

```sql
-- 比较完整的表创建
CREATE TABLE user2 (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL DEFAULT '',
  age TINYINT UNSIGNED NOT NULL DEFAULT 0,
  gender ENUM('男', '女') NOT NULL DEFAULT '男',
  PRIMARY KEY (id),
  INDEX uname(username),
  INDEX age(age)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
```

插入数据

```sql
INSERT INTO user (username, age) VALUES ('Tom', 12);

-- 插入多条数据
INSERT INTO user (username, age, gender) VALUES ('Mane', 22, '男'),('Jone', 20, '女');
```

更新数据

```sql
UPDATE user SET age=13,gender='女' WHERE username='Tom';
```

修改表名

```sql
-- TO/AS 都可以
ALTER TABLE user RENAME TO users;
```

删除表数据

```sql
-- DELETE 删除表的数据，保留结构，支持事务
DELETE FROM user;

-- TRUNCATE 删除表的数据，保留结构，不支持事务，不可撤销恢复
TRUNCATE user;
```

删除表

```sql
DROP TABLE user;
```

查询

```sql
-- 查询所有数据
SELECT * FROM user;

-- 查询某个字段
SELECT username FROM user;

-- 查询去重
SELECT DISTINCT gender FROM user;
```

分组
 
```sql
SELECT gender, count(gender) as count FROM user GROUP BY gender;
```

条件查询

```sql
-- >、>=、<>、<、<=、AND、OR、LIKE、BETWEEN、LIKE

-- BETWEEN 查询在某个区间的数据
SELECT * FROM user WHERE age BETWEEN 1 AND 20; 

-- LIKE 模糊查询，'%B%'(包含B),'B%'(B开头)，'%B'(B结尾)，'_o%'(下划线表示单个字符)
SELECT * FROM WHERE username LIKE 'B%';

SELECT * FROM　user WHERE username IN ('Tom', 'Jone');

SELECT * FROM user WHERE username REGEXP 'e$';
```

排序

```sql
-- DESC 降序， 
SELECT * FROM user ORDER BY age DESC;
```

限制和偏移

```sql
-- 从第二条数据开始查询两条
SELECT * FROM user LIMIT 2 OFFSET 1;

-- 上面的语句可简写为
SELECT * FROM user LIMIT 1,2;

-- 注意：ORDER BY 必须在 LIMIT 之前 WHERE(GROUP BY)之后
```

函数

```sql
-- count、sum、avg、lcase、ucase、len ...
SELECT * FROM user WHERE UCASE(usrename)=UCASE('tom')
```

联合查询

```sql
SELECT * FROM user, message WHERE user.id = message.uid;

CREATE TABLE message (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  uid INT(11) UNSIGNED NOT NULL DEFAULT 0,
  content VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
```

多表查询

```sql
-- 下面的语句结果跟内连接一样
SELECT * FROM user, message WHERE user.id = message.uid;
```

内连接

```sql
SELECT * FROM user JOIN message ON user.id = message.uid
```

左连接
```sql
SELECT * FROM user LEFT JOIN message ON user.id = message.uid;
```

## Sequelize

Sequelize 是一个基于 promise 的 Node.js ORM (Object Relational Mapping)，目前支持 Postgres, MySQL，SQLite 和 Microsoft SQL Server。它具有强大的事务支持，关联关系，读取和复制等功能

    npm i sequelize mysql2


```js
const Sequelize = require('sequelize')
const config = {
  database: 'test', 
  username: 'root',
  password: '',
  host: 'localhost',
  port: 3306
}

// 创建sequelize对象实例
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
})

sequelize.authenticate().then(() => {
  console.log('连接失败')
}).catch(err => {
  console.log('连接失败')
})

// 定义模型
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize: STRING(50),
    allowNull: false // 所有字段默认为 NOT NULL
  },
  age: {
    type: Sequelize.TINYINT,
  },
  gender: {
    type: Sequelize.ENUM('男', '女'),
  }
}, {
  timeStamps: false, // 是为了关闭Sequelize的自动添加timestamp的功能
  tableName: 'user'
})

// 查找数据
User.findAll({
  where: {
    age: 18
  }
}).then( users => {
  users.forEach(user => {
    console.log(user.get('username'))
  })
})

// 创建数据
let tom = User.build({ // User.create
  username: 'Tom',
  age: 20,
  gender: '男'
})

tom.set('age', 25)

tom.save()

User.findById(1).then(user => {
  user.set('username', 'lim)
  user.save()
})
```


