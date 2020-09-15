# 游戏通关率的基本思路

游戏通关事件类似这样：

```json
{
  "@timestamp": 111,
  "user_id": "zhangsan",
  "create_at": 100,
  "type": "play_game",
  "game": {
    "id": "fdasf",
    "first_open": 101,
    "retention": true,
    "scene_id": "djfkal",
    "level_id": 1 // 增加的属性
  }
}
```

查询聚合语句的大致结构：

- query
  - filter
    - `term: game.id=fdasf`，指定游戏 id
    - `term: game.retention=true`，游戏留存
    - `range: @timestamp`，取记录的起止时间
- aggs
  - `cardinality: user_id`，指标聚合，取游戏留存人数
  - `filter: exist game.level_id`，过滤聚合，过滤出所有通关记录
    - aggs:
      - `date_histogram @timestam`，取记录日期按天分组
        - aggs
          - `cardinality: user_id` 指标聚合，取该日通关用户数

另外，也可将`level_id`加入到聚合中（取消`filter: exist game.level_id`），可以更详细列出每个关卡的通关人数情况。不过这样比较复杂，不确定 Vega 是否好抽取数据展示。
