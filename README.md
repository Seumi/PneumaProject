# Pneuma Project

> 源代码抄袭检测平台  
> Developed by Seumi

## 运行环境

- Unbuntu 16.04 LTS 64bit （仅支持Linux）
- MongoDB 3.4
- node 8.10
- jdk 1.8.0
- enca 1.18
- zip 3.0
- unzip 6.0

## 目录结构
./--  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| build -生产环境配置文件  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| config -webpack配置文件  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| dist -生产环境编译目录  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| node_modules -node模块目录  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| server -后端代码目录  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| src -前端代码目录  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| static -静态文件目录  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| test -单元测试目录

## 配置文件
请先在./server/config/index.js内修改workplace的path和bin目录

## 使用步骤

``` bash
# 安装系统依赖(Ubuntu)
apt install enca node zip unzip

# 安装node依赖
npm install

# 启动前端，在localhost:8080
npm run dev

# 启动后端
npm run server
```