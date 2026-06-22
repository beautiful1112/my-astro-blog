---
title: Using command to config GRE or IPIP tunnel on Fortigate
description: Configure GRE and IPIP tunnels on Fortigate via CLI — tunnel source and tunnel interface are set separately, unlike Cisco-style devices.
date: 2024-08-02
tags: [Firewall, Fortigate]
category: Routing & Switching
---

Fortigate is one of the most famous firewalls in the world. However, some of its configuration still needs to be done using the command line, such as GRE or IPIP tunnel.

Configuring tunnel on fortigate is different from devices such as Cisco. The tunnel source and the tunnel interface itself need to be configured separately.

1. Configuring GRE or IPIP tunnel source;
2. Configuring tunnel interface.

## Configuring tunnel source

### GRE tunnel

```
config system gre-tunnel
    edit 'GRE'        #GRE name
         set remote-gw 100.0.0.1
         set local-gw 200.0.0.1
         set interface 'wan'
```

### IPIP tunnel

```
config system ipip-tunnel
     edit 'IPIP'
         set remote-gw 100.0.0.1
         set local-gw 200.0.0.1
         set interface 'wan'
```

## Configuring tunnel interface

### GRE interface

```
config system interface
     edit 'GRE'
         set ip 10.0.0.1 255.255.255.255   #tunnel virtual IP add subnet mask must be configured as /32
         set remote-ip 10.0.0.2 255.255.255.252
         set allowpass ping
         set type tunnel
         set interface 'wan'    #need to specify physical outgoing interface
```

### IPIP interface

```
config system interface
     edit 'GRE'
         set ip 20.0.0.1 255.255.255.255   #tunnel virtual IP add subnet mask must be configured as /32
         set remote-ip 20.0.0.2 255.255.255.252
         set allowpass ping
         set type tunnel
         set interface 'wan'
```

When you can ping the virtual IP of the tunnel interface, the tunnel is successfully established.
