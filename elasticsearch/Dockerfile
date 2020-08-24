# https://github.com/elastic/elasticsearch-docker
ARG ELK_VERSION

FROM docker.elastic.co/elasticsearch/elasticsearch:$ELK_VERSION

ARG ELK_VERSION

# https://github.com/medcl/elasticsearch-analysis-ik/releases]

ADD https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v$ELK_VERSION/elasticsearch-analysis-ik-$ELK_VERSION.zip /tmp/
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install -b file:///tmp/elasticsearch-analysis-ik-$ELK_VERSION.zip

RUN rm -rf /tmp/*