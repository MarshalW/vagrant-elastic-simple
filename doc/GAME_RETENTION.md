# 游戏留存数据的查询和聚合

查询聚合语句：

```
GET user-events-0915-1/_search
{
  "size": 0,
  "query":{
    "bool":{
      "filter":[
        {
          "range":{
            "game.first_open": {
              "gte": "now-10d/d",
              "lt": "now-9d/d",
              "time_zone": "+08:00",
              "format": "yyyy-MM-dd"
            }
          }
        },
        {
          "range":{
            "@timestamp": {
              "gte": "now-10d/d",
              "lte": "now-1d/d",
              "time_zone": "+08:00",
              "format": "yyyy-MM-dd"
            }
          }
        },
        {
          "term": {
            "game.id": "game-1"
          }
        }
      ]
    }
  },
  "aggs": {
    "open_game_users":{
      "filter": {
        "term": {
          "type": "open_game"
        }
      },
      "aggs": {
        "user_count": {
          "cardinality": {
            "field": "user_id"
          }
        }
      }
    },
    "game_retention":{
      "filter": {
        "term": {
          "game.retention": "true"
        }
      },
      "aggs": {
        "users_by_timestamp": {
          "date_histogram": {
            "field": "@timestamp",
            "calendar_interval": "1d",
            "time_zone": "+08:00"
          },
          "aggs": {
            "user_count": {
              "cardinality": {
                "field": "user_id"
              }
            }
          }
        }
      }
    }
  }
}
```

查询中写死的部分:

```json
  "query":{
    "bool":{
      "filter":[
        {
          "range":{
            "game.first_open": {
              "gte": "now-10d/d",
              "lt": "now-9d/d",
              "time_zone": "+08:00",
              "format": "yyyy-MM-dd"
            }
          }
        },
        {
          "range":{
            "@timestamp": {
              "gte": "now-10d/d",
              "lte": "now-1d/d",
              "time_zone": "+08:00",
              "format": "yyyy-MM-dd"
            }
          }
        },
        {
          "term": {
            "game.id": "game-1"
          }
        }
      ]
    }
  },
```

- `game.first_open`，应在 Dashboard 的 Filter 中设置
- `@timestamp`，应在 Dashboard 的默认时间范围中设置
- `game.id`，应在 Dashboard 的 Filter 中设置

基于上述查询聚合语句，结合 Vega，应可以实现所需的 Virtualization 组件。
