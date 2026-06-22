---
title: Install influxdb use docker-compose
description: Deploy InfluxDB 2.7.4 with Docker Compose — create the data directory, write the compose file, and verify the container is running.
date: 2024-01-27
tags: [Influxdb]
category: Docker
cover: ./images/influxdb-logo.webp
---

## Create a directory and a compose file

### Create a directory with root authority

```bash
sudo mkdir influxdb_data
```

### Check

```bash
zhaoyuqi@zhaoyuqi:~$ ls
influxdb_data  minio_data  snap
```

### Create a compose file

```bash
sudo nano docker-compose.yml
```

### Write config

```yaml
version: '3'
services:
  influxdb:
    image: influxdb:2.7.4
    container_name: influxdb
    restart: always
    ports:
      - 8086:8086
    volumes:
      - /home/zhaoyuqi/influxdb_data/:/var/lib/influxdb
    environment:
      - INFLUXDB_DB=mydb
      - INFLUXDB_ADMIN_USER=admin
      - INFLUXDB_ADMIN_PASSWORD=admin@123
      - INFLUXDB_USER=admin
      - INFLUXDB_USER_PASSWORD=admin@123
```

### Run this config file

```bash
zhaoyuqi@zhaoyuqi:~/influxdb_data$ sudo docker-compose up -d
Creating network "influxdb_data_default" with the default driver
Pulling influxdb (influxdb:2.7.4)...
2.7.4: Pulling from library/influxdb
af107e978371: Pull complete
13a67906d7dd: Pull complete
7f1ea001fd75: Pull complete
325b8c3f9e1a: Pull complete
1cc333a124f9: Pull complete
6be14e549600: Pull complete
5e8da0fdfa83: Pull complete
d4909fd9fdca: Pull complete
9509ef890624: Pull complete
b1abd7ca0728: Pull complete
Digest: sha256:02d64a7a0219c4d2f898c17bb296f2e2af93263bc7c8ad52e0387700d362df7f
Status: Downloaded newer image for influxdb:2.7.4
Creating influxdb ... done
```

### Check the running status of the docker image

```bash
zhaoyuqi@zhaoyuqi:~/influxdb_data$ sudo docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS         PORTS                                       NAMES
044063714bdd   influxdb:2.7.4  "/entrypoint.sh infl…"   3 minutes ago   Up 3 minutes   0.0.0.0:8086->8086/tcp, :::8086->8086/tcp   influxdb
```
