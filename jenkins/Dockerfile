FROM jenkins/jenkins:latest

RUN apt-get update && apt-get install -y docker-compose

COPY ../docker-compose.yml /usr/local/bin/docker-compose.yml