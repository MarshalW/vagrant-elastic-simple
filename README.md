# Elasticsearch 实践项目

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [版本分支](#版本分支)
- [需提前具备的条件](#需提前具备的条件)
- [项目执行步骤](#项目执行步骤)
  - [问题的定义](#问题的定义)
  - [运行实验环境](#运行实验环境)
  - [创建索引映射](#创建索引映射)
  - [生成模拟数据](#生成模拟数据)
  - [用户留存数据的可视化](#用户留存数据的可视化)
  - [游戏留存数据的查询和聚合](#游戏留存数据的查询和聚合)
  - [实现游戏通关率的基本思路](#实现游戏通关率的基本思路)
- [作为日常研究分析工具使用](#作为日常研究分析工具使用)
- [其他](#其他)

<!-- /code_chunk_output -->

希望通过这个项目帮助 Elasticsearch 学习者快速掌握有实践意义的相关的技能。

本项目将：

- 仅需执行几个命令，即可自动创建基于虚拟机的 Elasticsearch/Kibana 实验环境
- 提出一个严谨、抽象和简化的用户留存问题，这个问题广泛存在于数字化服务的各个领域
- 给出一个有关上述用户留存问题的 Elasticsearch/Kibana 可视化解决思路、步骤和方案
- 提供一个基于上述解决方案的大规模用户模拟数据生成工具，便于学习者对性能的评估和理解

## 版本分支

- [v2.0.0]()，当前版本，演示生产环境下的日志生成，通过 Filebeat 将客户服务器的日志转运到 Elasticsearch，将启动 2 个 VM，其中一个 VM 部署 Filebeat，另一个运行 Elasticsearch/Kibana
- [v1.0.0](https://github.com/MarshalW/vagrant-elastic-simple/tree/v1.0.0)，最简单的实现，启动 一个 VM，运行 Elasticsearch/Kibana，并生成模拟数据供查询统计评估使用

## 需提前具备的条件

开始使用本项目前，需要具备以下条件：

- 有一台性能较好的台式机/笔记本，主要是内存要尽量大（至少可以拿出 6GB 物理内存，其中 4GB 用于 Elasticsearch/Kibana 虚拟机，2GB 用于 Filebeat 虚拟机）
- 通读过 [Elasticsearch Reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html)，并掌握基本的创建索引、查询和聚合命令
- 通读过[Kibana Guide](https://www.elastic.co/guide/en/kibana/7.9/index.html)，并掌握基本的 Dev Tools、Discover 和 Dashboard 功能的使用
- 掌握基本的 Vagrant 和 Docker/docker-compose 命令的使用

## 项目执行步骤

### 问题的定义

首先需要阅读理解[有关用户留存统计问题的定义](./doc/PROBLEM.md)，这里提出了后续需要解决的问题。

可以认为这是需求，因为它不包含任何实现技术。

### 运行实验环境

实验环境包括在 Vagrant/Virtualbox 虚拟机下安装的:

- Docker
- docker-compose
- 在 docker/docker-compose 下容器
  - Elasticsearch 7.9.1
  - Kibana 7.9.1
  - Node.js 14.x
  - 模拟数据生成工具

在[安装、配置和运行实验环境](./doc/SETUP.md) 给出了完整的创建实验环境的步骤。

### 创建索引映射

为了执行后续的 Elasticsearch 查询和聚合，需要为索引显式声明索引映射。

详情见[创建索引映射](./doc/CREATE_INDEX_MAPPING.md)。

### 生成模拟数据

生成模拟数据的用途可用于：

- 验证统计分析的正确性
- 评估性能

具体步骤见[生成模拟数据](./doc/MOCKDATA.md)

### 用户留存数据的可视化

针对用户留存数和用户留存率，给出：

- 查询和聚合的命令
- 使用上述命令，结合 Kibana Vega，给出可视化代码
- 性能分析

学习者可生成模拟数据并验证上述命令和可视化的正确性。

具体见[用户留存数据的可视化](./doc/USER_RETENTIONS.md)

### 游戏留存数据的查询和聚合

针对游戏留存率，给出查询和聚合的命令。

学习者可：

- 根据查询命令，结合 Kibana，自己定制可视化代码
- 通过模拟数据工具生成所需数据规模数据，并给出性能分析结论
- 验证查询命令和可视化的正确性

具体见[游戏留存数据的查询和聚合](./doc/GAME_RETENTION.md)

### 实现游戏通关率的基本思路

有关通关率，给出编写查询和聚合语句的基本思路，学习者可：

- 根据基本思路，编写适合的查询和聚合命令
- 基于查询和聚合命令，结合 Kibana，定制可视化代码
- 通过模拟数据工具生成所需数据规模数据，并给出性能分析结论
- 验证查询命令和可视化的正确性

具体见[游戏通关率的基本思路](./doc/GAME_LEVEL.md)

## 作为日常研究分析工具使用

使用 Elasticsearch 解决一般数据统计分析的过程可总结为：

- 将问题用严谨语言表述和抽象化，转化为数学问题的需求
- 静态数据建模，主要是形成 Elasticsearch Index Mapping
- 生成少量模拟数据，可以参照本项目模拟数据工具自行编写实现，或者通过 Kibana Dev Tools 手工加入
- 编写查询和聚合命令，在 Kibana Dev Tools 执行，并验证执行结果的正确性
- 使用模拟数据工具生成生产环境所需上限规模的数据，执行查询聚合，评估性能
- 定制 Kibana Dashboard，使用上述确定的查询和聚合命令
  - 根据要展示的指标，确定使用哪种 Vitualization 组件形式
  - 配置 Vitualization 组件，基于查询和聚合命令配置
  - 如果基本的 Vitualization 组件不能满足需求，可使用 Vitualization Vega，后者有更大的灵活性，覆盖更大的需求

使用本项目，可参照上述过程，实现

- 在本地使用 Vigrant/Virtualbox 虚拟机的研发工作
- 本项目可部署在公有云 ECS 上做生产环境的测试和评估
  - 执行相关脚本安装所需工具，和本地环境一致
  - 因此，后续过程和命令使用和本地使用也类似
  - 可通过 VS Code Remote，直接在本地执行 ECS，类似本地的情况

## 其他

- [在生产环境生成大规模数据](./doc/GENERATE_MOCK_DATA.md)
