# Minimal Python multicast lab

Learning receiver and sender—not a production low-latency handler. Use documentation addresses and a lab VLAN only.

## Receiver

```python
import socket

GROUP = "239.10.10.10"
PORT = 15000
LOCAL_INTERFACE = "192.0.2.20"

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 8 * 1024 * 1024)
sock.bind(("0.0.0.0", PORT))
membership = socket.inet_aton(GROUP) + socket.inet_aton(LOCAL_INTERFACE)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, membership)

while True:
    payload, peer = sock.recvfrom(65535)
    print(len(payload), peer)
```

## Sender

```python
import socket

GROUP = "239.10.10.10"
PORT = 15000
LOCAL_INTERFACE = "192.0.2.10"

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF,
                socket.inet_aton(LOCAL_INTERFACE))
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 16)
sock.sendto(b"sequence=1", (GROUP, PORT))
```

## Lab checklist

1. Capture IGMP Report after the receiver starts (`tcpdump -ni eth0 -vv igmp`).
2. Confirm `/proc/net/igmp` lists `239.10.10.10` on the intended interface.
3. Capture UDP data: `udp and dst host 239.10.10.10 and dst port 15000`.
4. Mis-set `LOCAL_INTERFACE` on the receiver and observe join/data failure.
5. Lower sender TTL to `1` across a router and confirm drop.

For SSM, use `MCAST_JOIN_SOURCE_GROUP` (or platform equivalent) with source `192.0.2.10` and group `232.10.10.10`. See [Socket operations](02_Socket_Operations.md).

## Risks

- Lab code with huge `SO_RCVBUF` masking host drops in production metrics.
- Binding `0.0.0.0` plus wrong interface join on multi-homed hosts.

## Cross-links

[UDP and multicast](01_UDP_and_Multicast.md), [Linux inspection](../14_Configuration_and_Observation/01_Linux_Inspection.md).

---
