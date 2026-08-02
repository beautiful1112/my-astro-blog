# Minimal Python multicast lab

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Learning receiver—not a production low-latency handler:

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

Sender:

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

