# TODO

- Elasticsearch 从 v7.8 开始支持新的 index template 方式，目前 Filebeat 只支持旧写法，当前 v7.9.0
- 需要理清楚下面配置的关联关系
  - setup.template
    - name
    - pattern
  - setup.ilm
    - pattern
    - rollover_alias
  - output.elasticsearch.index
