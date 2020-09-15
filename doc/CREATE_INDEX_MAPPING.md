# 创建数据索引映射


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [索引映射](#索引映射)
- [事件示例](#事件示例)

<!-- /code_chunk_output -->


## 索引映射

以下命令可复制到 Kibana Dev Tools 下手工提交。

不过，按照实验项目执行步骤，不必手工提交，因为模拟生成数据脚本里已经包括这个步骤。

```json
PUT /user-retentions-2020-0914
{
  "mappings": {
    "properties": {
      "@timestamp": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      },
      "user_id": {
        "type": "keyword"
      },
      "create_at": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      },
      "type": {
        "type": "keyword"
      },
      "game.id": {
        "type": "keyword"
      },
      "game.first_open": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      },
      "game.scene_id": {
        "type": "keyword"
      },
      "game.retention": {
        "type": "boolean"
      }
    }
  }
}
```

- create_at，用户注册的日期，所有涉及该用户的事件都要带这个属性
- type，目前的值有：
  - signup 用户注册
  - open_game 用户加载游戏
  - play_game 玩完一个游戏场景（game scene）
- `game.id`
- game.scene_id type=play_game 时，要有游戏场景的 id
- game.first_open 该用户第一次打开这个游戏的时间戳，所有涉及该用户与这个游戏有关的事件都要带这个属性
- game.retention，该用户 play_game，且玩过的游戏场景>1，有这个属性，而且为 true
- 以上索引映射支持问题的前两部分，用户留存和游戏留存，未涵盖通关率


## 事件示例

TODO