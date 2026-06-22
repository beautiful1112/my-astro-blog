---
title: Install grafana use docker-compose
description: Step-by-step guide to deploying Grafana with Docker Compose, including directory setup, compose configuration, and fixing file permission errors.
date: 2024-01-29
tags: [Grafana]
category: Docker
cover: ./images/grafana-logo.png
---

## Create a directory with root authority

```bash
sudo mkdir grafana_data
```

### Check

![Directory listing after creating grafana_data](./images/check-directories.png)

## Create a compose file

```bash
sudo nano docker-compose.yml
```

### Write config

```yaml
version: '3'
services:
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - 3000:3000
    volumes:
      - /home/zhaoyuqi/grafana_data:/var/lib/grafana
```

### Run this config file

```bash
sudo docker-compose up -d
```

![Docker Compose pulling and starting Grafana](./images/docker-compose-up.png)

But I found the image failed to run:

![Grafana container stuck in Restarting state](./images/container-restarting.png)

After checking the log, it is found that the file permission error causes the operation failure:

```bash
sudo docker logs grafana
```

![Grafana logs showing permission denied on /var/lib/grafana](./images/permission-error-logs.png)

## Modifying folder permissions

```bash
sudo chown -R 472:472 /home/zhaoyuqi/grafana_data
```

## Restart image, it has run properly

```bash
sudo docker-compose up -d
```

![Grafana container running successfully on port 3000](./images/container-running.png)
