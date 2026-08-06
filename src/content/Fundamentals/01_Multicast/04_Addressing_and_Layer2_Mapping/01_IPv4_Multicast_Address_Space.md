# IPv4 multicast address space

IPv4 multicast is `224.0.0.0/4` (`224.0.0.0` through `239.255.255.255`). Important blocks:

| Range | Meaning |
|---|---|
| `224.0.0.0/24` | Local Network Control; routers do not forward it regardless of TTL. |
| `224.0.1.0/24` | Internetwork Control; not inherently link-local. |
| `232.0.0.0/8` | Standard IPv4 SSM range. |
| `233.252.0.0/24` | Documentation/test examples. |
| `234.0.0.0/8` | Unicast-prefix-based allocation. |
| `239.0.0.0/8` | Administratively scoped organization-local space. |

Maintain an address registry. An application channel is typically identified by source, group, UDP port, environment, feed, and line—not by group alone.

