#!/bin/sh
set -e

JAVA_OPTS="-Djava.net.preferIPv4Stack=true"
JAVA_OPTS="$JAVA_OPTS -DzooKeeper.hosts=$ZOOKEEPER_HOSTS"
JAVA_OPTS="$JAVA_OPTS -Dservice.identification=$SERVICE_IDENTIFICATION"
JAVA_OPTS="$JAVA_OPTS -Dservice.domain=$SERVICE_DOMAIN"
JAVA_OPTS="$JAVA_OPTS -Dservice.ajpPort=$SERVICE_AJP_PORT"
JAVA_OPTS="$JAVA_OPTS -Dservice.httpPort=$SERVICE_HTTP_PORT"
JAVA_OPTS="$JAVA_OPTS -Dservice.path=$SERVICE_PATH"
export JAVA_OPTS

exec /usr/share/tomcat7/bin/catalina.sh run
