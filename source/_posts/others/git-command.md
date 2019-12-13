---
title: git 基本命令 
date: 2019-8-13 15:50:12
categories: others
tags: 
  - git
---

## git 命令

### 设置 git 全局邮箱和用户名

```git
git config --global user.name "yourgithubname"
git config --global user.email "yourgithubemail"
```

### 设置 ssh key  

```
# 查看密钥是否存在
ls ~/.ssh

# 生成密钥
ssh-keygen -t rsa -C "youremail"

# 查看密钥，并把它复制到 github 或者 codding 等相关平台
cat ~/.ssh/id_rsa_pub

# 最后验证一下
ssh -T git@github.com
ssh -T git@git.codding.net   #或者 codding 平台
```

### 创建分支

```
git checkout -b 分支名称
```
|命令|说明|
|:---|:---|
|git add .|将修改的代码添加到暂存区 (. 代表当前目录)|
|git commit -m "message"|将缓存区的内容添加到本地仓库|
|git status|查看当前暂存区状态|
|git remote add origin 仓库地址|添加远程仓库|
|git push -u origin master|把本地仓库推送到远程服务器|
|git log [<option>]|查看版本演变历史 option:  `--all`（所有分支） `--graph`（图形化显示当前分支日志信息） `-nm`（m表示数字，显示当前分支最近m次的提交记录日志信息）  `--oneline`（当前分支简要日志信息） |
|git remote show [remote-name]|查看某个远程仓库的详细信息，例如：git remote show origin|
|git pull [<options>] [<repos>] [<refspec>...]|从一个仓库或本地分支拉取并且整合代码\<refspec\>表示分支的名字，options: `--allow-unrelated-histories`（允许无关历史）`-ff` `-no-ff` `-ff-only` ff (fast-forward) 表示快速合并| 
|git reset --merge|回退|

## 问题解决
### 连接超时错误
出现以下错误：

```
ssh: connect to host github.com port 22: Connection timed out
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

解决办法：  
1. 打开 git 的安装目录中的 `etc/ssh/ssh_config` 文件，添加以下代码  

```
Host github.com
User youremail@qq.com
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443
```

2. 在 git 命令窗口中输入 `ssh -T git@gitub.com`，按照提示输入yes，最后会出现下面的提示

```
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

### 系统换行符不同导致的警告

```
warning: LF will be replaced by CRLF in source/_posts/others/browser-rendering.md.
The file will have its original line endings in your working directory.
```

git 采用 linux（换行符为\n） 规范，若文件中存在\r\n符号，它会自动帮你转为 \n, 可使用下列命令消除警告

```
git config core.filemode false
git config core.eol crlf
```
