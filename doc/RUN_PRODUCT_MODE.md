# 生产环境模式下的使用

项目对 docker-compose 配置文件做了区分，用如下命令将用生产模式启动：

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

生产模式下的不同：

- Elasticsearch 9200 端口只能在本地访问
- Kibana 5601 端口只能在本地访问
- 可在`./docker-compose.prod.yml`中增加有关 Nginx+certbot 的服务，proxy 到 Kibana，如：[docker-nginx-certbot](https://github.com/staticfloat/docker-nginx-certbot)
- 访问 Kibana 会要求登录，用户名和密码的设置在 `./.env`文件
- Elasticsearch 的数据文件不再保存在容器默认路径，而是覆盖为`./docker-compose.prod.yml`的相关路径，这样重建容器不会造成索引数据的丢失
