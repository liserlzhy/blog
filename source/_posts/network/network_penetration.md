---
layout: network
title: penetration
p: network/network_penetration
date: 2021-03-31 01:33:47
tags:
---

## 1.1配置apt命令在线安装包的源为国内源

### 1.1.1 配置apt国内源

中科大Kail源：
```
deb http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib

复制上面两行到下面的文件中
# vim /etc/apt/sources.list
```
扩展： 
1. 复制：在kali终端下，使用鼠标选中内容，就可以完成kali下复制
2. 黏贴：移动鼠标到需要黏贴的位置，按下鼠标中间的滚轮即可

说明：deb代表软件的位置，deb-src代表软件源代码位置

### 1.1.2 软件更新

apt update：获取更新列表

apt upgrade 和 dist-upgrade的差别：

upgrade：升级时，如果软件包有相依性问题，此软件包就不会被升级。

dist-upgrade升级时，如果软件包有相依性问题，会移除旧版，直接安装新版本。（所以通常dist-upgrade会被认为是有点风险的升级）

+ 在每回更新之前，需要先运行update，然后才能运行upgrade和dist-upgrade，因为相当于update命令获取了包的一些信息，比如大小和版本号，然后再来运行upgrade去下载包

### 1.1.3 apt和apt-get区别

apt是一条linux命令，适用于deb包管理式的操作系统，主要用于自动从互联网的软件仓库汇总搜索、安装、升级、卸载软件或操作系统。deb包是Debian软件包格式的文件扩展名。

apt可以看作是apt-get和apt-cache命令的子集，可以为包管理提供必要的命令选项

apt提供了大多数与apt-get和apt-cache有的功能

## 2.1 本地网络配置

### 2.1.1 临时配置ip地址

```
ifconfig eth0 192.168.1.53/24 #临时配置IP
route add default gw 192.168.1.1 #配置默认路由
echo nameserver 8.8.8.8 > /etc/resolv.conf #配置DNS服务器
```

### 2.1.2 永久配置IP地址

```
vim /etc/network/interface

添加以下内容：
auto etho
#iface etho inet dhcp #注释此行
iface etho inet static
address 192.168.1.53
netmask 255.255.255.0
gateway 192.168.1.1

重启网络服务:
/etc/init.d/networking restart #方法一
systemctl restart networking #方法二
```

## 2.2 配置 sshd 服务并使用 xshell 连接

### 2.2.1 允许root用户登录sshd服务

```
vim /etc/ssh/sshd_config

修改32行、37行为：
32 PermitRootLogin yes
37 PubkeyAuthentication yes

重启服务：
/etc/init.d/ssh restart
或者
systemctl restart ssh

配置sshd开机启动
update-rc.d ssh enable
```
### 2.2.3 ssh连携

Xme5
序列号：150105-116578-999990

上传文件到服务器
apt install lrzsz
rz #上传
sz #下载

## 2.3 购买一台国外的VPS服务器

### 2.3.1 搬瓦工介绍

搬瓦工(BandwagonHost) VPS，隶属于美国知名主机提供商IT7.NET公司旗下，由于其具有超低廉的价格和超高品质的服务，一直倍受中国用户好评。又因英文名和拼音 Ban Wa Gong 十分相似，久而久之被大家称作“搬瓦工"。

官方地址：https://bwh88.net/aff.php?aff=47237