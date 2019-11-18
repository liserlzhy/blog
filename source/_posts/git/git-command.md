---
title: git 基本命令 
date: 2019-8-13 15:50:12
categories: node
tags: 
  - node api
---
|命令|说明|
|:--|:--|
|git status|查看当前暂存区状态|
|git log [<option>]|查看版本演变历史 option:  `--all`（所有分支） `--graph`（图形化显示当前分支日志信息） `-nm`（m表示数字，显示当前分支最近m次的提交记录日志信息）  `--oneline`（当前分支简要日志信息） |
|git remote show [remote-name]|查看某个远程仓库的详细信息，例如：git remote show origin|
|git pull [<options>] [<repos>] [<refspec>...]|从一个仓库或本地分支拉取并且整合代码\<refspec\>表示分支的名字，options: `--allow-unrelated-histories`（允许无关历史）`-ff` `-no-ff` `-ff-only` ff (fast-forward) 表示快速合并| 
|git reset --merge|回退|
|git remote add origin 仓库地址|添加远程仓库|
|git push -u origin master|把本地仓库推送到远程仓库|
<!-- more -->