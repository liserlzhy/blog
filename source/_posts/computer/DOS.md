---
title: DOS 命令
date: 2019-9-18 18:8:50
categories: computer
tags: 
  - node api
---

## 内部命令和外部命令
+ 内部命令
    - 系统自带的命令，例如ping mv等
+ 外部命令
    - 放在window\system32，可自行扩展，如下载wget.exe放在该目录下可调用

## 基本命令
查看帮助信息

    命令 /?

|命令|描述|
|:--|:--|
|title|设置console上面的title|
|mode|配置控制台参数，如控制台窗口大小|
|color|设置窗口颜色|
|cd|切换目录|
|dir|查看当前目录下的文件|
|copy|复制文件（不包括文件夹）|
|xcopy|复制文件（包括文件夹）|
|rename|（缩写 ren）重命名| 
|move|移动文件|
|replace|替代文件|
|type|查看文件内容|
|del|删除文件|
|rd|删除文件夹|
|md|创建文件|

## set设置局部变量
### 定义变量  
    set name=xxx
### 查看变量
set不带参数会显示所有系统变量

    set name
### 删除变量
    set name=
### 算数运算
    set /a 10+4

    ----------demon.bat文件
    @echo off
    set /a var=4*3
    echo %var%

### 接收用户的输入信息（/p）

    ----------demon.bat
    @echo off
    set /p var=请输入一个数字：
    echo 你输入的数字是：%var%
    pause >nul

## setx设置永久变量
### 配置环境变量r
    setx PATH "%path%;文件路径"
    需要重新打开窗口才会看到生效
## 注释
    @echo off
    rem 我是解释文字 exit 退出命令
    :: 我也是解释文字，你看不见我的
    exit 
    pause 
## 特殊字符
查看上一条命令是否执行成功 

    echo %errorlevel%
    输出0为成功

### 管道符 |
将第一条命令的结果作为第二天命令的参数来执行

    dir C:\ | find "ell" 
    
    netstat -ano |findstr TCP

### 组合命令 
+ &
    - 当第一条命令执行失败了，后边的命令还会继续执行  
    - 输出e盘和f盘的文件：`dir e:/ & dir f:/`

+ &&
    - 第一条命令失败时，后边的命令不会继续执行
+ ||
    - 第一条命令失败后才执行第二天命令
+ ()
+ ;

## 通配符
? -- 单个字符
    
    输出文件名<=3个字符的文件
    dir f:\???
\* -- 所有

## if 条件语句
exist / not exist 存不存在  
/i 忽略大小写  
== 判断字符串是否相等   
equ 判断数值是否相等
defined 是否定义

    @echo off
    if exist c:\test.txt (echo 存在test文件) else (type nul>c:\test & echo 创建成功)

    set var = hello
    if defined var (echo 已定义) else (echo 没有被定义)

    if /i %var%=="Hello" (echo 相等) else (echo 不相等)
    pause >nul

### 数值之间的比较
|中文含义|关系符|英文解释|
|:--|:--|:--|
|等于|equ|equal|
|大于|gtr|greater than|
|大于或等于|geq|greater than or equal|
|小于|lss|less than|
|小于或等于|leq|less than or equal|
|不等于|neq|no equal|

## for 循环

    cmd控制台写法
    for %i in (1 2 3 4 5) do echo %i 

    /d 匹配文件夹
    for /d %i in (*) do echo %i

    -----------------------------------
    遍历文件------demo.bat
    @echo off
    for %%i in (c:\*.txt) do echo %%i
    pause >nul

    /l 步进 步长为2
    for /l %%i in (1,2,10) do echo %%i

    打开5次百度
    for /l %%i in (1,1,5) do start www.baidu.com

    /r 层叠遍历所有子文件
    for /r f:\ %%i in (*.txt) do echo %%i

    打印出demo.txt中的内容，类似type
    for /f "delims=" %%i in (f:\demo.txt) do echo %%i
    
    skip -- 跳过第几列
    tokens -- 提取第几列 
    for /f "skip=1 tokens=1,2 delims= " %%i in (f:\demo.txt) do echo %%i %%j 


## 重定向操作符
\>、>> 

    会覆盖之前的结果
    ping www.baidu.com >c:\test.txt

    不覆盖，追加内容
    ping www.baidu.com >>c:\test.txt

<  

    读取test.txt内容并排序显示在控制台中
    sort < test.txt

句柄的数字代码描述  
0：键盘输入  
1：输出到命令提示窗  
2：错误输出

    di >right.txt 2>error.txt

## telnet
telnet 就是查看某个端口是否可访问。

    telnet www.baidu.com 80
## netstat
-a 所有，-n以数字形式显示，-o 显示进程ID

    netstat -ano

## 实战：查询端口被哪个进程占用
涉及命令：
+ netstat 查询tcp/ip连接命令  
+ tasklist 列举任务进程
+ taskkill 杀死任务进程
+ taskmgr 打开任务管理器

1、根据62537端口值查找PID

    netstat -ano |findstr 62537
2、根据PID查看该任务列表

    tasklist |findstr 5772

3、杀死该任务
    taskkill /im notepad.exe /f
## ipconfig
可用于显示当前的TCP/IP配置，一般用来检验人工配置的TCP/IP设置是否正确

|命令|描述|
|:--|:--|
|ipconfig /all|显示本地计算机所有网络连接情况，如：IP地址，子网掩码，DNS配置，DHCP配置等|
|ipconfig /release|释放ip|
|ipconfig /renew|重新获取ip|
|ipconfig /flushdns|刷新DNS|
## net
### net user
打开user管理图形界面

    lusrmgr.msc

查看用户账号  

    net user

创建用户账号  
    
    net user newuser /add

禁用用户

    net user newuser /active:no

重新启用

    net user newuser /active:yes

加入管理员组

    net localgroup administrators newuser /add

查看是否加入成功

    net user newuser

从组中移除

    net localgroup administrators newuser /del

删除账号

    net user newuser /del

### net share 
图形界面：`compmgmt`
+ net share 查看共享
+ net share f=F:/ 共享F盘 
+ net share f /del 取消共享
+ net view \\\\主机名 查看特定主机共享
+ net share disk$=e: 隐藏共享

## 服务
 `services.msc`

停止xxx服务
    
    net stop xxx

开启xxx服务

    net start xxx

## netsh
netsh(Network Shell)，网络配置命令行工具，可用来修改windows的ip、网关、dns等信息

### netsh 基本命令
用法： 
1. netsh
2. int ip
3. dump

备份网络配置

    netsh dump > 路径

设置静态IP

    set address name="本地连接" source=static addr=192.168.0.7 mask=255.255.255.0

设置自动获取IP

    set address name="本地连接" source=dhcp

设置其他（网关, DNS等）

    set address name="本地连接" gateway=127.19.96.1 gwmetric=1

### netsh修复网络故障
`netsh winsock reset`
    
    作用是重置Winsock目录。如果计算机Winsock配置有问题的话将会导致网络连接等问题，通过重置Winsock目录借以修复网络，可以重新初始化网络环境，以解决由于软件冲突、病毒原因造成的参数错误问题。

`netsh int ip reset c:\resetlog.txt`

    作用是重置TCP/IP协议，相对于卸载并重新安装TCP/IP协议，使其恢复到初始安装操作系统时的状态。

### netsh设置防火墙
图形界面： `firewall.cpl`

关闭防火墙

    netsh firewall set opmode mode=disable

开启防火墙

    netsh firewall set opmode mode=enable

### netsh获取已连接过的wifi密码
查看当前系统已保存的网络

    netsh wlan show profiles

查看指定wifi的密码

    netsh wlan show profile name="ssid" key=clear

搭建无线网络

    netsh wlan set hostednetwork mode=allow ssid=wname key=123456
    netsh wlan start hosted

## shutdown关机设置
设置120秒后重启

    shutdown /r -t 120

取消上一条命令

    shutdown /a

## attrib设置文件属性
查看文件的属性

    attrib demo.txt

添加只读属性 (h隐藏属性 -删除)

    attrib +r +h demo.txt

## goto 跳转命令
    @echo off
    goto part1

    :part1
    echo hello
    pause
## start 
可以在命令行下打开盘符、目录、文件、网址等  
start /max C:\ -------------- 最大化打开C盘  
start /min   

打开带有空格的文件夹 "aa bb"

    start "" "aa bb"
## call 程序互相调用
    @echo off
    call demo.bat
    pause

## sort 排序
从第三个字母进行排序

    sort /+3 demol.txt

倒序之后保存在1.txt

    sort /r demol.txt > 1.txt
    或者
    sort /r demol.txt /o 1.txt

## 判断网络故障
>原因：TCP/IP协议出错、TCP/IP配置出错、物理故障、中毒等  

检查本地TCP/IP协议是否安装正常 

    ping 127.0.0.1 (localhost)

检查网关连接是否畅通

    ping 192.168.1.1

检查电脑与外部网络连接是否畅通

    ping www.baidu.com

## 修复系统 (系统文件缺失)
`sfc /scannow` 扫描并尽可能修复保护的系统文件

系统日志：Windows/Logs/CBS/CBS.log
## 磁盘修复
图形界面：`compmgmt`
### chkdsk (系统当掉或非法关机)

修复磁盘上的错误

    chkdsk -f

查找坏扇区并恢复可读信息

    chkdsk /r

### convert 
把磁盘转为NTFS

    convert f: /fs:ntfs

### diskpart
`diskpart`

列出有哪些盘符：`list disk`  
选择磁盘1：`select disk 1` 
查看详情：`detail disk` 
选择分区：`select partition1`
格式化磁盘：`clean`  
创建主分区：`creat partition primary`  
定义磁盘：`format fs=ntfs quick label="E:"`

## 激活系统
查看系统版本：`winver`  
查看激活信息：`slmgr /dli || slmgr /xpr`  
卸载产品密钥：`slmgr /upk`  
安装产品密钥：`slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX`  
设置密钥管理服务器计算机名：`slmgr /skms zh.us.to`  
成功的激活产品：`slmgr /ato`

## [wget下载网路资源](https://www.cnblogs.com/hzdx/p/6432161.html)
下载地址：https://eternallybored.org/misc/wget/
wget特点
+ 支持断点下传功能
+ 同时支持FTP和HTTP下载方式
+ 支持代理服务器
+ 设置方便简单
+ 程序小，完全免费  

-o, --output-file=FILE 将软件输出信息保存到文件； 
-i, --input-file=FILE 从文件中取得URL  
-r, --recursive 下载整个网站，目录（小心使用）  
-l, --level=NUMBER 下载层次

    命令如下：
    wget -r -p -k -np -nc -e robots=off http://www.example.com/mydir/
    如果要想下载整个网站，最好去除-np参数。   
    wget -r -p -k -nc -e robots=off http://www.example.com/mydir/
    
    -r 递归；对于HTTP主机，wget首先下载URL指定的文件，然后（如果该文件是一个HTML文档的话）递归下载该文件所引用（超级连接）的所有文件（递 归深度由参数-l指定）。对FTP主机，该参数意味着要下载URL指定的目录中的所有文件，递归方法与HTTP主机类似。   
    -c 指定断点续传功能。实际上，wget默认具有断点续传功能，只有当你使用别的ftp工具下载了某一文件的一部分，并希望wget接着完成此工作的时候，才 需要指定此参数。
    
    -nc 不下载已经存在的文件
    -np 表示不追溯至父目录，不跟随链接，只下载指定目录及子目录里的东西；
    -p 下载页面显示所需的所有文件。比如页面中包含了图片，但是图片并不在/yourdir目录中，而在/images目录下，有此参数，图片依然会被正常下 载。
    
    -k 修复下载文件中的绝对连接为相对连接，这样方便本地阅读。
    -o down.log 记录日记到down.log
    -e robots=off 忽略robots.txt
## reg注册表操作
图形界面：`regedit`  
+ `reg query`
+ `reg add`
+ `reg delete`
+ `reg export`
+ `reg import`

## 加速网络速度
+ `gpedit`
+ `ipconfiig /flushdns`
+ `netsh interface tcp show global`
+ `netsh interface tcp set global autotuninglevel=normal`

## 批量找出特定后缀名的文件名

    for /r f:\ %i in (*.txt) do echo %i

## 清理系统垃圾

    @echo off
    echo 请勿关闭本窗口！
    echo 正在清除系统垃圾文件，请稍等.....
    del /f /s /q %systemdrive%\*.tmp
    del /f /s /q %windir%\prefetch\*.* rd /s /q %windir%\temp & md %windir%\temp
    del /f /s /q "%userprofile%\Local Settings\Temp\*.*"
    del /f /s /q %systemdrive%\*._mp
    del /f /s /q %windir%\*.bak
    del /f /s /q %systemdrive%\*.log
    del /f /s /q %systemdrive%\*.gid
    del /f /s /q %systemdrive%\*.chk
    del /f /s /q %systemdrive%\*.old
    del /f /s /q %systemdrive%\recycled\*.*
    del /f /q %userprofile%\cookies\*.*
    del /f /q $userprofile%\recent\*.*
    del /f /s /q "%userprofile%\Local Settings\Temporary Internet Files\*.*"
    echo 清除系统垃圾完成！
    pause >nul
## 死循环
会不断打开cmd窗口

    @echo off
    start cmd
    %0

## 提升为临时管理员权限

    runas /noprofile /user:mymachine\administrator cmd

    runas /user:mymachine\Administrator /sa "C:\Program Files\Internet Explorer\iexplore.exe"
    
## 系统帐户统一管理

    @echo off
    title 账号管理
    echo
    :start 
    echo 1、添加账号	2、删除账号	3、查看已有账号
    echo 4、关闭管理员账号	5、开启管理员账号
    set /p var=请输入数字：
    if not defined var goto start
    if %var%==1 goto 1
    if %var%==2 goto 2
    if %var%==3 goto 3

    :1
    set str=%random%
    net user user%str% /add
    goto start

    :2
    set /p str=请输入要删除的账号：
    net user %str% /del

    :3
    net user
    goto start

    pause >nul

## 文件查询搜索

    @echo off
    :start
    set /p var=请输入你要搜索的名字:
    type demo.txt | findstr %var%

    if %var%==exit (goto end) else (goto start)

    :end
    exit
    pause >nul

## IPC$ 入侵
IPC$ 是共享"命名管道"的资源，利用IPC$，连接者甚至可以与目标主机建立一个空的连接而无需用户名与密码（当然，对方机器必须开了IPC$共享，否则你是连接不上的），而利用这个空的连接，连接者还可以得到目标主机上的用户列表（不过负责的管理员会禁止导出用户列表的）。

建立空连接:

    net use \\IP\ipc$ "" /user:""

建立非空连接:

    net use \\IP\ipc$ "用户名" /user:"密码"

映射默认共享

    net use z: \\IP\c$ "密码" /user:"用户名"
    （即可将对方饿c盘映射为自己的z盘，其他盘类推）

如果已经和目标建立了ipc$，则可以直接用IP+盘符+$访问
    
    net use z: \\IP\c$

删除一个ipc$连接

    net use \\IP\ipc$ /del

删除共享映射

    net use c: /del 

## 设置IP和DNS
网路连接界面：`ncpa.cpl`

### 静态获取

    echo 开始设置ip和dns...
    ::设置变量
    set name="WLAN"
    set ipaddress=192.168.1.10
    set mask=255.255.255.0
    set gateway=192.168.1.1
    set dns=114.114.114.114
    set wins=8.8.8.8

    ::主体部分
    echo 正在设置IP地址
    netsh interface ip set address name=%name% source=static addr=%ipaddress% mask=%mask% gateway=%gateway% 
    echo 正在设置DNS
    netsh interface ip set dns name="WLAN" source=static addr=%dns%
    echo 正在设置备用DNS
    netsh interface ip add dns "WLAN" addr=%wins% index2

    echo 设置完毕
    pause >nul

### 动态获取

    @echo off
    echo 自动获取IP地址....
    netsh interface ip set address name="WLAN" source = dhcp
    echo 自动获取DNS服务器....
    netsh interface ip set dns name="WLAN" source=dhcp
    echo 恭喜你，设置成功
    pause >nul

## 将bat文件转为exe文件
   
+ 1、可借助第三方工具：bat to exe
+ 2、通过自解压软件
    - 把.bat文件在到一个文件夹中
    - 添加到压缩文件，以.exe为后缀名
    - 在高级->高级自解压选项->设置解压路径->添加自动运行程序

## hack 常用命令
`systeminfo` 查看系统信息   
`arp -a` 地址映射   
`net view` 查看局域网内其他计算机名称     
`ping -t -l 65550 ip` 死亡之ping:   
`shutdown -s -t 180 -c "你被黑了，系统马上关机` 取消：`shutdown -a`    
`msg username hello world` 给某用户发送信息  
`copy con 123.txt` 创建文件 ctrl+Z 回车保存    
`start 123.txt`  图形界面打开  
`type 123.txt` 在命令行查看文件  
`del 123.txt` 删除文件  
`tree` 树形结构  
`net use K: \\192.168.3.100\c$` 磁盘映射，内外网都可，防火墙会拦截  
`at 22:00 shutdown -s -t 180` 设置计划任务    
`at` 查看所有计划任务    
`at id号` 开启已注册的某个计划任务    
`at /delete` 停止所有计划任务，用参数/yes则不需要确认就直接停止  
`at id号 /delete` 停止某个已注册的计划任务 
