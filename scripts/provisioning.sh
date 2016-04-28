#!/bin/bash

set -e


# Install PostgreSQL and PostGIS if it hasn't been installed yet:
dpkg -s postgresql-9.4 > /dev/null 2>&1 && {
	echo "PostgreSQL is installed. Skipping ..."
} || {
	echo "PostgreSQL is not installed. Installing ..."
	apt-get update \
		&& apt-get install -y --no-install-recommends \
			postgresql-9.4 \
			postgresql-9.4-postgis-2.1 \
			postgresql-contrib-9.4
			
	echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/9.4/main/pg_hba.conf
	echo "listen_addresses='*'" >> /etc/postgresql/9.4/main/postgresql.conf
	
	service postgresql restart
}
		
# Create a database if it doesn't exist yet:
if [ $(sudo -u postgres psql --list -qA | grep flamingo4 | wc -l) -eq 0 ]; then
	echo "Creating flamingo4 database ..."
	
	sudo -u postgres createuser flamingo4
	sudo -u postgres psql -c "alter user flamingo4 with password 'secret';"
	sudo -u postgres psql -c "SET SESSION AUTHORIZATION flamingo4";
	sudo -u postgres createdb -l en_US.UTF-8 -E UTF-8 flamingo4
	
	service postgresql restart
	
fi

# Install TomCat
apt-get update
echo "Start installing TomCat"
apt-get install -y --no-install-recommends tomcat7
service tomcat7 stop

#Copy context.xml en server.xml
cp -v /vagrant/TomCatConfig/*.xml /etc/tomcat7

apt-get install unzip

#download flamingo deps.zip
wget "http://source.b3p.nl/Flamingo4/deps.zip" -O "deps.zip"
unzip deps.zip
yes | mv -f *.jar /usr/share/tomcat7/lib 

#get the flamingo wars
echo "get flamingo"
wget "http://repo.b3p.nl/nexus/content/repositories/releases/org/flamingo-mc/viewer/4.6.0/viewer-4.6.0.war" -O "/var/lib/tomcat7/webapps/viewer.war"
wget "http://repo.b3p.nl/nexus/content/repositories/releases/org/flamingo-mc/viewer-admin/4.6.0/viewer-admin-4.6.0.war" -O "/var/lib/tomcat7/webapps/viewer-admin.war"

#unpack flamingo wars
cd /var/lib/tomcat7/webapps

mkdir viewer
cd viewer
unzip ../viewer.war

cd ..

mkdir viewer-admin
cd viewer-admin
unzip ../viewer-admin.war

cd ~/

#create a link to the idgis components the idgis components
mkdir -p /var/lib/tomcat7/webapps/viewer/idgis
ln -s viewer/src/main/webapp/idgis/components /var/lib/tomcat7/webapps/viewer/idgis/components

#start tomcat
service tomcat7 start