# 测试 vega-lite

在 kibana visualization vega 下的测试。


## 留存率v1

```
{
  $schema: https://vega.github.io/schema/vega-lite/v4.json
  title: 用户留存率

  data: {
    url: {
      index: retention-*
      body: {
        query:{
          bool:{
            filter:[
              {
                range:{
                  create_at:{
                    gte:"2020-08-03"
                    lte:"2020-08-03"
                    format: "yyyy-MM-dd"
                  }
                }
              }
            ]
          }
        }
        aggs: {
          by_retention_days: {
            date_histogram: {
              field: action_time
              calendar_interval: 1d
              extended_bounds: {
                max: {%timefilter%: "max"}
              }
              min_doc_count: 0
            }
            aggs:{
              users_count:{
                cardinality: { field: "user_id" }
              }
            }
          }
        }
        size: 0
      }
    }
    format: {property: "aggregations.by_retention_days.buckets"}
  }
  
  transform:[
    {window:[
      {op:"first_value" field:"users_count.value" as:"total_users"}
    ]}
    {calculate:"datum.users_count.value/datum.total_users* 100" as:"retention_rate"}
  ]

  mark: line

  encoding: {
    x: {
      field: key
      type: temporal
      axis: {title: false, "format": "%y-%m-%d"} 
    }
    y: {
      field: retention_rate
      type: quantitative
      axis: {title: "%留存率"}
    }
  }
}
```

## 留存率，在kibana设置指定日期过滤器

指定日期过滤器

```
{
  "range": {
    "create_at": {
      "gte": "now-23d/d",
      "lte": "now-22d"
    }
  }
}
```

vega代码：

```
{
  $schema: https://vega.github.io/schema/vega-lite/v4.json
  title: 用户留存率

  data: {
    url: {
      index: retention-*
      body: {
        query: {
          bool: {
            must: [
              "%dashboard_context-must_clause%"
            ]
            must_not: [
              "%dashboard_context-must_not_clause%"
            ]
            filter: [
              "%dashboard_context-filter_clause%"
            ]
          }
        }
        aggs: {
          by_retention_days: {
            date_histogram: {
              field: action_time
              calendar_interval: 1d
              extended_bounds: {
                max: {%timefilter%: "max"}
              }
              min_doc_count: 0
            }
            aggs:{
              users_count:{
                cardinality: { field: "user_id" }
              }
            }
          }
        }
        size: 0
      }
    }
    format: {property: "aggregations.by_retention_days.buckets"}
  }
  
  transform:[
    {window:[
      {op:"first_value" field:"users_count.value" as:"total_users"}
    ]}
    {calculate: "datum.users_count.value/datum.total_users*100" as:"retention_rate"}
  ]

  mark: line

  encoding: {
    x: {
      field: key
      type: temporal
      axis: {title: false, "format": "%y-%m-%d"} 
    }
    y: {
      field: retention_rate
      type: quantitative
      axis: {title: "%留存率"}
    }
  }
}
```