---
title: pm2线上部署
p: node/pm2
date: 2020-05-16 17:27:04
categories: node
---

## SSH 配置

### ssh免密登录到服务器

1. 本地生成密钥对

```
ssh-keygen -t rsa -C 'xxx@qq.com'

# -t 指定密钥类型，可省略
# -C 注释文字，可省略
```
<!-- more -->

2. 把公钥 id_rsa.pub 添加到服务器下的authorized_keys文件里

```
cat ~/.ssh/id_rsa.pub | ssh username@host 'cat >> ~/.ssh/authorized_keys' 
```

3. 这样就可以使用以下命令免密登录了

```
ssh username@host
```

4. 通过别名直接登录: `ssh 别名`

在本地~/.ssh/config文件中添加以下配置

```
Host 别名
HostName ip地址或域名
User 用户名
Port 22
``` 

### 配置github SSH KEY

把上面本地生成的公钥id_rsa.pub添加到github网站上的SSH KEY

### 配置github deploy key

在服务器生成密钥对

``` 
cd ~/.ssh
ssh-keygen -t rsa -C 'xxx@qq.com'
cat id_rsa.pub
```

把公钥复制黏贴到github上要部署的项目仓库 deploy key里

## pm2

安装pm2 

```
npm i -g pm2 
```
### pm2 配置文件

在项目的根目录新建 ecosystem.config.js 文件，也可通过 `pm2 init` 快速创建。

```js
// ecosystem.config.js
module.exports = {
  "apps": [{
    "name" :"xxx", // 项目名称
    "script": "app.js", // 启动脚本
    "watch": true, // 监听目录的变化，自动重启
    "ignore_watch": [ // 在监控目录中排除
      "node_modules",
      "logs",
      "public"
    ],
    "watch_options": {
      "followSymlinks": false
    },
    "env" :{ // 开发环境变量
      "PORT": 5000,
      "NODE_ENV": "development"
    },
    "env_production": { // 生产环境变量
      "PORT": 80,
      "NODE_ENV": "production"
    },
    "error_file": "./logs/app_err.log", // 错误日志输出路径
    "output_file": "./logs/app_out.log", // 普通日志
    "merge_logs": true, // 以追加内容方式添加日志
    "log_date_format": "YYYY-MM-DD HH:mm:ss"
  }],
  "deploy": {
    "production": {
      "user": "root", // 服务器用户名
      "host": "yourdomain.com", // 服务器ip或域名
      "ref": "origin/master", // 仓库分支
      "repo": "git@github.com:xxxx/xxxx.git", // 仓库ssh url
      "path": "/home/www", // 项目要放置在服务器中的目录
      "port": "22", // ssh 端口，默认22
      "ssh_options": "StrictHostKeyChecking=no",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production",
      "pre-deploy-local": "echo 'Deploy Done'",
      "pre-setup": "rm -rf /home/www/source", // 部署项目之前先删除之前的项目
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 项目部署

```
# 先把项目推送到github仓库上
git remote set origin git@github.com:xxxx/xxxx.git
git add .
git commit -m 'first push'
git push origin master

# 把项目部署到服务器上
pm2 deploy ecosystem.json production setup

# 开启服务
pm2 deploy ecosystem.json production
```

配置成功后，打开 http://yourdomain.com 就可浏览你的项目了

### pm2 基本命令

```
pm2 list                    # 查看所有启动项目
pm2 logs                    # 查看所有日志
pm2 log <APPName>/<id>      # 查看某个进程的日志
pm2 info <APPName>/<id>     # 查看进程详细信息
pm2 monit <APPName>/<id>    # 打开监控 logs
pm2 restart <APPName>/<id>  # 项目重启
pm2 delete <APPName>/<id>   # 删除某个项目进程  
```
## 把本地项目复制到服务器中的方法

Linux scp 命令用于 Linux 之间复制文件和目录，window系统可使用git bash进行操作

```
scp -r local-dir root@ip:remote_dir
#在本地终端执行上述命令：
#【local-dir】为本地路径；
#【ip】为你服务器的ip； 
#【remote_dir】为你放到远程服务器的地址，我们这里是 /root 
```

## 问题总结

### Host key verification failed

```
Host key verification failed.
fatal: Could not read from remote repository.
Please make sure you have the correct access rights and the repository exists.
  failed to clone
Deploy failed
```

此时主要是在远程服务器中，并未将http://github.com加入known_hosts，在服务器端通过如下命令设置

```
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
```

### Warning: Permanently added the RSA host key ...

```
Warning: Permanently added the RSA host key for IP address '13.250.177.223' to the list of known hosts.
```

解决方案：

linux：

在vim /etc/hosts文件下添加如下内容：

13.250.177.223 github.com   根据自己的Ip修改

windows：

在C:\Windows\System32\drivers\etc\hosts文件添加

13.250.177.223 github.com   根据自己的Ip修改

### warning: LF will be replaced by CRLF in 

windows中的换行符为 CRLF， 而在linux下的换行符为LF，所以在执行add . 时出现提示，解决办法：

```
git config --global core.autocrlf false
```

### fatal: destination path '/xxx' already exists

```
fatal: destination path '/home/liserl/www/source' already exists and is not an empty directory.
```

在ecosystem.json中配置
```
"pre-setup": "rm -rf /xxx/source"
```
### bash: npm: command not found

方法1：vim ~/.bashrc 把下面几行注释掉

```
#case $- in
#    *i*) ;;
#      *) return;;
#esac
```

方法2：把npm进行软链接 (pm2: command not found 也可通过设置软连接解决) 

```
whereis npm # 获取原来的地址
ln -s /root/.nvm/versions/node/v10.16.0/bin/npm /usr/local/bin/
```

### /usr/bin/env: node: No such file or directory

```
ln -s /root/.nvm/versions/node/v10.16.0/bin/node /usr/bin/node
```


