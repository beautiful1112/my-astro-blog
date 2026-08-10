# Multicast socket operations

A working receiver is more than “open UDP and read.” Membership, interface selection, TTL, and source filters are separate socket options. Binding a port is not a join; membership belongs to a socket/interface context.

## Receiver sequence

1. Create a datagram socket (`SOCK_DGRAM`, `IPPROTO_UDP`).
2. Set reuse and receive-buffer options as required (`SO_REUSEADDR`, optionally `SO_REUSEPORT`, `SO_RCVBUF`).
3. Bind the UDP port (wildcard or group address—OS-dependent).
4. Join `G` on the correct interface (`IP_ADD_MEMBERSHIP` / `MCAST_JOIN_GROUP`), or `(S,G)` for SSM (`IP_ADD_SOURCE_MEMBERSHIP` / `MCAST_JOIN_SOURCE_GROUP`).
5. Read quickly; validate application sequences and record drop counters.

## Sender options

| Option | Role |
|---|---|
| `IP_MULTICAST_IF` | Egress interface (IPv4 address or index) |
| `IP_MULTICAST_TTL` / `IPV6_MULTICAST_HOPS` | Scope; too low stops at first hop |
| `IP_MULTICAST_LOOP` | Loopback to local sockets on the sending host |
| IPv6 | `IPV6_MULTICAST_IF`, `IPV6_JOIN_GROUP`, `MCAST_JOIN_SOURCE_GROUP` |

Receivers commonly use `IP_ADD_MEMBERSHIP`, `IP_ADD_SOURCE_MEMBERSHIP`, `MCAST_JOIN_GROUP`, and `MCAST_JOIN_SOURCE_GROUP` where supported.

Related: [Python lab](03_Python_Lab_Receiver_and_Sender.md), [Binding multiple receivers](04_Binding_and_Multiple_Receivers.md).

## Configuration patterns

### ASM join — `IP_ADD_MEMBERSHIP` (C sketch)

```text
struct ip_mreq mreq;
mreq.imr_multiaddr.s_addr = inet_addr("239.10.10.10");
mreq.imr_interface.s_addr = inet_addr("192.0.2.20");
setsockopt(fd, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq));
```

### SSM join — `MCAST_JOIN_SOURCE_GROUP`

```text
struct group_source_req gsr;
gsr.gsr_interface = if_nametoindex("eth0");
/* gsr.gsr_group = sockaddr_in { 232.10.10.10, port ignored for membership } */
/* gsr.gsr_source = sockaddr_in { 192.0.2.10 } */
setsockopt(fd, IPPROTO_IP, MCAST_JOIN_SOURCE_GROUP, &gsr, sizeof(gsr));
```

Older SSM path: `IP_ADD_SOURCE_MEMBERSHIP` with `struct ip_mreq_source` (`imr_multiaddr`, `imr_sourceaddr`, `imr_interface`).

### Sender TTL and interface

```text
int ttl = 16;
setsockopt(fd, IPPROTO_IP, IP_MULTICAST_TTL, &ttl, sizeof(ttl));

struct in_addr ifaddr;
ifaddr.s_addr = inet_addr("192.0.2.10");
setsockopt(fd, IPPROTO_IP, IP_MULTICAST_IF, &ifaddr, sizeof(ifaddr));
```

### Python equivalents

```text
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP,
                socket.inet_aton("239.10.10.10") + socket.inet_aton("192.0.2.20"))
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 16)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF,
                socket.inet_aton("192.0.2.10"))
```

Leave with `IP_DROP_MEMBERSHIP` / `MCAST_LEAVE_SOURCE_GROUP` so snooping and PIM can prune promptly.

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP/MLD** | Kernel emits Reports from successful joins |
| **Firewall** | May drop Reports or data after a successful `setsockopt` |
| **VRF / namespaces** | Join is per-netns; wrong ns = silent no traffic |
| **SO_REUSEPORT** | May shard packets across processes—test the kernel |

## Verification

```text
# Membership visible to kernel
cat /proc/net/igmp
ip maddr show dev eth0

# Report on the wire
tcpdump -ni eth0 -vv igmp

# Socket owner
ss -uapn | grep 15000
```

Checklist: correct `ifindex`/interface address; SSM source matches feed `S`; TTL sufficient to cross the campus; leave on shutdown.

## Risks

- Joining on `INADDR_ANY` when the host has multiple NICs—kernel picks an unexpected interface.
- Binding success with join failure (check `errno`).
- Forgetting to leave; stale group state until timers expire.
- Assuming Windows/BSD option names match Linux exactly.

## Interview framing

“Bind selects the UDP port; `IP_ADD_MEMBERSHIP` / `MCAST_JOIN_SOURCE_GROUP` selects who may deliver multicast to that socket on a chosen interface—senders set `IP_MULTICAST_IF` and `IP_MULTICAST_TTL` instead of joining.”

---
