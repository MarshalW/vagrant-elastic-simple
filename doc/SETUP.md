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
  - [登录虚拟机](#登录虚拟机)
  - [启动 Elasticsearch 和 Kibana](#启动-elasticsearch-和-kibana)
  - [访问 Kibana](#访问-kibana)
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
    - Elasticsearch 7.9
    - Kibana 7.9
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

### 对内存的配置

主机的内存应尽量大，否则会造成 Elasticsearch 运行缓慢。

我的测试环境是：

- macOS，系统内存 16GB
- 给虚拟机 Ubuntu 18.04 设置的内存是 6GB
- Elasticsearch 堆内存设置为 3GB

建议最低配置为：

- 虚拟机至少 2GB 内存
- Elasticsearch 堆内存至少 1GB

虚拟机内存设置在 `./Vagrantfile`

```
vb.memory = "6096"
```

Elasticsearch 堆内存设置在 `./docker-compose.yml`

```
ES_JAVA_OPTS: "-Xms3g -Xmx3g"
```

### 安装 Vagrant 相关软件

如果是在 macOS 下，可直接通过 Homebrew 安装 Vagrant/Virtualbox:

```properties
brew cask install virtualbox
brew cask install vagrant
```

## 安装和配置

### 安装 Vagrant 虚拟机

在项目根目录下执行：

```properties
vagrant up
```

将自动完成如下内容：

- 创建 virtualbox 虚拟机
  - 使用 ubuntu server 18.04 镜像
  - 访问地址为：`192.168.100.10`
  - 禁用系统 swap
  - 设置时区为中国时区
- 虚拟机安装
  - docker
  - docker-compose
  - node.js

整个安装过程可能比较漫长，这取决于你的网络状况。

因为有关软件的更新和安装需要访问国外的资源。

### 登录虚拟机

在项目根目录执行命令：

```properties
vagrant ssh
```

可检查 docker 安装和运行情况：

```properties
docker ps -a
```

无需 sudo，已经将当前用户加入 docker group

### 启动 Elasticsearch 和 Kibana

切换目录：

```properties
cd /vagrant
```

然后启动 docker compose：

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
  "name": "d5bd285fdb44",
  "cluster_name": "docker-cluster",
  "cluster_uuid": "zS8SzcYFSyO-c5ykBxzsiA",
  "version": {
    "number": "7.9.0",
    "build_flavor": "default",
    "build_type": "docker",
    "build_hash": "a479a2a7fce0389512d6a9361301708b92dff667",
    "build_date": "2020-08-11T21:36:48.204330Z",
    "build_snapshot": false,
    "lucene_version": "8.6.0",
    "minimum_wire_compatibility_version": "6.8.0",
    "minimum_index_compatibility_version": "6.0.0-beta1"
  },
  "tagline": "You Know, for Search"
}
```

### 访问 Kibana

在浏览器中访问：http://192.168.100.10:5601/

如果能看到 Kibana 界面就说明可以正常使用了。

因为 Elasticsearch 启动比较慢，可能会有短暂的 `connection reset by peer` 报错。

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
docker logs elasticsearch
```


