# 安装、配置和运行实验环境

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [准备工作](#准备工作)
  - [clone 项目代码](#clone-项目代码)
  - [配置文件](#配置文件)
  - [对内存的配置](#对内存的配置)
  - [安装 Vagrant 相关软件](#安装-vagrant-相关软件)
- [安装和配置](#安装和配置)
  - [安装 Vagrant 虚拟机](#安装-vagrant-虚拟机)
  - [启动 Elasticsearch 和 Kibana](#启动-elasticsearch-和-kibana)
  - [访问 Kibana](#访问-kibana)
  - [启动 mock-logger 和 Filebeat](#启动-mock-logger-和-filebeat)
  - [mocklog 的配置](#mocklog-的配置)
  - [mocklog 执行的任务](#mocklog-执行的任务)
  - [Filebeat 的配置](#filebeat-的配置)
- [日常运行](#日常运行)
  - [启动和关闭 Elasticsearch 相关服务](#启动和关闭-elasticsearch-相关服务)
  - [关闭和重启虚拟机](#关闭和重启虚拟机)
  - [销毁虚拟机](#销毁虚拟机)
- [故障排除](#故障排除)
  - [查看 Elasticsearch 日志](#查看-elasticsearch-日志)

<!-- /code_chunk_output -->

安装过程用于搭建如下实验环境：

- Vagrant (需要了解 vagrant 的使用)
- Virtualbox（Vagrant 需要）
- 在 Vagrant/Virtualbox 虚拟机下安装了:
  - Docker
  - docker-compose
  - 在 docker/docker-compose 下容器
    - Elasticsearch 7.9.1
    - Kibana 7.9.1
    - Node.js 14.x

## 准备工作

### clone 项目代码

```properties
git clone https://github.com/MarshalW/vagrant-elastic-simple.git
```

### 配置文件

将 `./Vagrantfile.template` 复制为 `./Vagrantfile`

```properties
cp ./Vagrantfile.template ./Vagrantfile
```

将 `./env` 复制为 `./.env`

### 对内存的配置

主机的内存应尽量大，否则会造成 Elasticsearch 运行缓慢。

建议配置为：

- Elasticsearch/Kibana 虚拟机

  - 虚拟机至少 2GB 内存，建议 4GB 或者更多
  - Elasticsearch 堆内存配置最多为虚拟机物理内存的一半，不能再大了
  - CPU 最少分配 2 个核心

- Filebeat/mock-logger 虚拟机
  - 内存有 1GB 就足够了

### 安装 Vagrant 相关软件

如果是在 macOS 下，可直接通过 Homebrew 安装 Vagrant/Virtualbox:

```properties
brew cask install virtualbox
brew cask install vagrant
```

如果需要配置 proxy，需要安装`vagrant-proxyconf`插件：

```properties
vagrant plugin install vagrant-proxyconf
```

## 安装和配置

### 安装 Vagrant 虚拟机

在项目根目录下执行：

```properties
vagrant up
```

将自动完成如下内容：

- 创建 2 台 virtualbox 虚拟机，安装和配置基本相同
  - 使用 ubuntu server 18.04 镜像
  - 访问地址为
    - Elasticsearch/Kibana：`192.168.100.10`
    - mock-logger/Filebeat: `192.168.100.11`
  - 禁用系统 swap
  - 设置时区为中国时区
- 虚拟机安装
  - docker
  - docker-compose
  - node.js

整个安装过程可能比较漫长，这取决于你的网络状况。

因为有关软件的更新和安装需要访问国外的资源。

### 启动 Elasticsearch 和 Kibana

在项目根目录执行命令：

```properties
vagrant ssh elasticserver
```

可检查 docker 安装和运行情况：

```properties
docker ps -a
```

无需 sudo，已经将当前用户加入 docker group

切换目录：

```properties
cd /vagrant
```

复制`env`文件为`.env`，是 docker-compose 要用到的参数：

```properties
cp env .env
```

然后启动 docker-compose：

```properties
docker-compose up -d
```

第一次启动会很慢，因为要下载 elasticsearch 和 kiban 的 docker 镜像。

启动完毕后，可检查是否安装成功：

```properties
curl localhost:9200
```

如果能看到类似这样的内容就说明成功了：

```json
{
  "name": "37c9c2e10960",
  "cluster_name": "docker-cluster",
  "cluster_uuid": "DnkzyBDKRVSSXeoJ3wAomQ",
  "version": {
    "number": "7.9.1",
    "build_flavor": "default",
    "build_type": "docker",
    "build_hash": "083627f112ba94dffc1232e8b42b73492789ef91",
    "build_date": "2020-09-01T21:22:21.964974Z",
    "build_snapshot": false,
    "lucene_version": "8.6.2",
    "minimum_wire_compatibility_version": "6.8.0",
    "minimum_index_compatibility_version": "6.0.0-beta1"
  },
  "tagline": "You Know, for Search"
}
```

### 访问 Kibana

在浏览器中访问：http://192.168.100.10:5601/

如果能看到 Kibana 界面就说明可以正常使用了。

因为 Elasticsearch 启动比较慢，Kibana 可能会有短暂的 `Connection refused` 报错。

### 启动 mock-logger 和 Filebeat

在项目根目录执行命令：

```properties
vagrant ssh mocklog
```

切换目录：

```properties
cd /vagrant
```

不必再处理`.env`了，这个虚拟机和 Elasticsearch 的虚拟机共用一个`.env`

然后启动 docker-compose：

```properties
docker-compose -f docker-compose.mock-log.yml up -d
```

将启动 2 个容器：

- mocklog，这是一个 node.js 程序，代码在`./mock-logger`目录下，自动生成模拟事件并输出日志，第一次`docker-compose up`的时候将做`docker build`生成容器镜像，会有点慢
- Filebeat，配置为获取并解析 mocklog 的日志，然后提交给 Elasticsearch

启动完毕可通过`docker ps -a`检查容器是否正常运行。

然后，可在 Kibana 的 Index Management 中查看是否生成了索引，索引名称类似 `mocklog-2020.09.27-000001`，而且刷新还可以看到文档数在增长。

### mocklog 的配置

mocklog 的默认配置在`./mock-logger/lib/config.js`:

```js
// 一次性生成模拟数据的参数
// 从之前多少天开始
export const DYAS_AGO = 10;
// 生成的用户总数
export const USER_COUNT = 1000 * 1;
// 生成的游戏总数
export const GAME_COUNT = 5;

// 后续日常模拟数据的参数
// 一次循环中选择的用户数
export const CHOOSE_USERS_COUNT = 100;
// 每个用户平均模拟事件次数
export const AVERAGE_EVENTS = 5;
// 事件最小间隔(ms)
export const DELAY_MIN = 10;
// 事件最大间隔(ms)
export const DELAY_MAX = 1000 * 60;
```

可以自定义配置，在`./mock-logger/`下创建`config.js`，使用自定义的参数。

然后，设置`docker-compose.mock-log.yml`文件：

```yaml
services:
  mock_logger:
    build:
      context: ./mock-logger
    image: mock-logger
    container_name: mock-logger
    restart: always
    # 加下面2行
    volumes:
      - ./mock-logger/config.js:/usr/src/app/lib/config.js
    ..
```

默认配置生成的模拟数据较少，可以自定义增加数据量。

### mocklog 执行的任务

mocklog 主要执行 2 个任务

- 先一次性的生成历史数据，生成前 n 天的数据，不包括今天
- 在一次性数据生成结束后，使用历史数据中的用户信息和游戏信息，继续随机生成游戏打开和玩的事件，并一直持续下去

### Filebeat 的配置

索引格式的定义在`./filebeat/fields.yml`

涉及索引的生命周期配置在`./filebeat/ilm.json`

Filebeat 自身的配置在`./filebeat/config.yml`

## 日常运行

### 启动和关闭 Elasticsearch 相关服务

启动：

```properties
docker-compose up -d
```

关闭：

```properties
docker-compose down
```

### 关闭和重启虚拟机

退出：

```properties
vagrant halt
```

重新启动：

```properties
vagrant reload
```

### 销毁虚拟机

如果要彻底销毁虚拟机，即让 Vagrant 关闭并删除所有虚拟机文件：

```properties
vagrant destroy
```

## 故障排除

### 查看 Elasticsearch 日志

如果遇到错误，首先要能找到 Elasticsearch 日志，执行 `docker logs` 命令:

```properties
docker logs elasticsearch -f
```
