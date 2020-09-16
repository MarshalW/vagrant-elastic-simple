# 在生产环境生成大规模数据

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [准备工作](#准备工作)
- [通过 VS Code Remote SSH 运行](#通过-vs-code-remote-ssh-运行)
- [使用 screen 命令执行长时间任务](#使用-screen-命令执行长时间任务)
- [运行时查看 Elasticsearch 当前堆内存](#运行时查看-elasticsearch-当前堆内存)

<!-- /code_chunk_output -->

## 准备工作

- 有一台性能强大可供访问的远程服务器
- 配置可通过用户密钥 ssh 登录
- 在本地安装 VS Code

## 通过 VS Code Remote SSH 运行

阅读[Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh)，了解如何安装配置。

基本操作是

- 在 VS Code 中通过 Remote SSH 连接到远程服务器
- 进入 TERMINAL，应该已经 ssh 登录到远程服务器的用户根目录
- 执行 git clone 命令，clone 当前项目到指定目录，比如 `~/projects/vagrant-elastic-simple`
- 在 TERMINAL 下执行 `code ~/projects/vagrant-elastic-simple`
- 会打开新的 VS Code 窗口，以后就在此窗口下开发运行
- 可以关闭之前的 VS Code 窗口
- 可在 TERMINAL 下执行 `mock-data`
- 可在 TERMINAL 右侧工具条选择 `Split Terminal`，同时开多个 TERMINAL ，方便并行运行多个 `mock-data`

## 使用 screen 命令执行长时间任务

生成大规模的 mock data 很耗时，可以通过`screen`命令。

可参考：[How To Use Linux Screen](https://linuxize.com/post/how-to-use-linux-screen/)

基本用法：

- 进入一个 screen session，`screen -S test1`，`test1` 是自定义的 session 名
- 进入 screen 后，运行任务中，可 `ctrl+a d`，退出和当前 screen session 的连接
- 在退出 screen 后，可以通过`screen -ls`查看当前运行中的 screen session
- 可通过 `screen -r test1`再次连接进入之前断开的 session

## 运行时查看 Elasticsearch 当前堆内存

查看本地 Elasticsearch 的堆内存：

```properties
curl -sS  "localhost:9200/_cat/nodes?h=heap*&v"
```

如果需要持续跟踪：

```
watch curl -sS  "localhost:9200/_cat/nodes?h=heap*&v"
```