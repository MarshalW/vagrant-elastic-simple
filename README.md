# 说明

本示例用于搭建如下实验环境：

- vagrant+virtualbox
- docker/docker-compose
- elasticsearch single node/kibana 7.9

## 前提条件

### 硬件

对硬件的要求，内存最好有16GB。

本项目代码中设置的是使用6GB。

如果内存较少，那么需要对本项目的文件做调整

- `Vagrantfile`中`vb.memory = "6096"`可适当减少
- `docker-compose.yml`中`ES_JAVA_OPTS: "-Xms3g -Xmx3g"`需要减少，要少于`vb.memory`，至少留有1G内存给系统运行

内存少会造成启动elasticsearch缓慢。

### 软件

需要安装：

- virtualbox
- vagrant

macOS 下都可以通过 Homebrew 安装:

```
brew cask install virtualbox
brew cask install vagrant
```

## 如何使用

### 下载代码

clone项目：

```
git clone https://github.com/MarshalW/vagrant-elastic-simple.git
```

### 启动vagrant

启动vagrant，命令行在项目根目录下执行：

```
vagrant up
```

将完成：

- 创建virtualbox虚拟机，访问地址为：`192.168.100.10`
- 给虚拟机安装docker和docker-compose
- 设置代理服务器到宿主机，加速安装过程

### 登录虚拟机

ssh登录到启动完毕的虚拟机，在项目根目录执行命令：

```
vagrant ssh
```

可检查docker安装和运行情况：

```
docker ps -a
```

### 安装和启动elasticsearch和kibana

在vagrant虚拟机下，切换到/vagrant目录：

```
cd /vagrant
```

然后执行：

```
docker-compose up -d
```

启动完毕后，可检查elasticsearch是否正常运行：

```bash
$ curl localhost:9200
{
  "name" : "d5bd285fdb44",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "zS8SzcYFSyO-c5ykBxzsiA",
  "version" : {
    "number" : "7.9.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "a479a2a7fce0389512d6a9361301708b92dff667",
    "build_date" : "2020-08-11T21:36:48.204330Z",
    "build_snapshot" : false,
    "lucene_version" : "8.6.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

### 访问kibana

在浏览器中访问：http://192.168.100.10:5601/

### 退出elasticsearch/kibana

```
docker-compose down
```

### 销毁虚拟机

退出虚拟机，在项目根目录执行命令：

```
vagrant destroy -f
```

将清空虚拟机。
