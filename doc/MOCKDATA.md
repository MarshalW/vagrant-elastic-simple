# 如何生成模拟数据

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [准备工作](#准备工作)
  - [依赖库](#依赖库)
  - [定制索引名称](#定制索引名称)
- [运行](#运行)
  - [简单的执行](#简单的执行)
  - [隐藏参数设置](#隐藏参数设置)
- [模拟的基本逻辑说明](#模拟的基本逻辑说明)

<!-- /code_chunk_output -->

以下所有操作，都需要在`vagrant ssh`登录
到虚拟机后执行。

并切换目录到`/vagrant`。

## 准备工作

### 依赖库

模拟数据工具是由 node.js 开发的，需要安装工具依赖库：

```
npm i
```

显示版本号：

```
./bin/mock-data --version
```

如果运行没有报错，说明依赖库安装没有问题

### 定制索引名称

运行前需要在代码中修改生成索引的名称，见`./lib/elasticsearch-output.js`：

```js
const INDEX_NAME = "user-events-0913";
```

## 运行

### 简单的执行

生成数据：

```
./bin/mock-data -a 10 -u 1000  -g 5
```

- `-a`，从当前日期 0 时起，到以前的天数，10 可表示从昨天开始过去的 10 个日历天
- `-u`，要生成的用户总数，会平均分摊到各天，平均值向上取整
- `-g`，要生成的游戏数

数据规模主要取决于用户数，建议本地测试时用户在 1000 左右，太大会很慢。

### 隐藏参数设置

另有 2 个参数，可以在需要的时候设置，见`events-generator.js`:

```js
// 一个用户最多玩游戏的次数
const MAX_PLAY_GAME_TIMES = 100;
// 一个用户最多玩游戏的天数
const MAX_PLAY_GAME_DAYS = 100;
```

## 模拟的基本逻辑说明

TODO
