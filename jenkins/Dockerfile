FROM jenkins/jenkins

USER root

RUN apt-get update

RUN apt-get install sudo

RUN curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

RUN chmod +x /usr/local/bin/docker-compose

# COPY docker-compose.yml /usr/local/bin/docker-compose.yml