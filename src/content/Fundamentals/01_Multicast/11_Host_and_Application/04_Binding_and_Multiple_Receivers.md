# Binding and multiple receiver processes

`SO_REUSEADDR`, `SO_REUSEPORT`, wildcard versus group-address binding, and delivery to multiple sockets vary by OS. Test the exact target kernel before designing a multi-process feed handler.

A production receiver should log selected interface/index, group/source/port, effective socket buffers, join result, first/last packet time, sequence state, and kernel/socket drop counters. Reuse behavior can otherwise distribute packets between processes in surprising ways.

## Binding choices

| Bind address | Typical effect |
|---|---|
| `0.0.0.0` / `::` | Receive unicast and multicast to the port (subject to join) |
| Group address (`239.x` / `232.x`) | May restrict delivery to that group on some stacks |
| Specific unicast host IP | Usually **wrong** for multicast receive |

Always join after bind. Order matters on some stacks: bind → setsockopt membership → read.

## Reuse options

| Option | Intent | Pitfall |
|---|---|---|
| `SO_REUSEADDR` | Allow bind when address/port in TIME_WAIT or shared | Alone may not duplicate multicast to all sockets |
| `SO_REUSEPORT` | Multiple sockets bind same port; kernel load-balances | Can **shard** a feed across workers—each sees a subset |
| Exclusive bind | One owner | Second process fails loudly (often preferable) |

Linux `SO_REUSEPORT` hashing is useful for unicast servers; for market data you usually want **one** consumer per `(S,G,port)` or an explicit fan-out inside one process.

## Configuration patterns

### Linux / C — exclusive-style receiver

```text
int yes = 1;
setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));
/* Prefer NOT enabling SO_REUSEPORT for a single market-data consumer */
bind(fd, 0.0.0.0:15000);
setsockopt(... IP_ADD_MEMBERSHIP ...);
```

### Two processes on one host (lab)

```text
# Process A and B both: SO_REUSEADDR + SO_REUSEPORT + same join
# Send sequenced UDP to 239.10.10.10:15000
# Compare sequence sets — expect partition or duplication depending on kernel
```

Document which outcome your kernel produces; do not assume BSD == Linux.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Containers** | Each netns needs its own join; host bridge may or may not snoop |
| **AF_XDP / DPDK** | Bypass socket reuse entirely; one userland consumer owns the queue |
| **iptables** | Per-process ownership does not bypass INPUT drops |

## Verification

```text
ss -uapn | grep 15000
cat /proc/net/igmp
# Two PIDs bound? Log which sequences each receives
```

Production logging fields:

```text
ifindex, ifname, group, source, port
SO_RCVBUF effective, join rc / errno
first_seq, last_seq, gaps, dups
UDPInErrors, RcvbufErrors, NIC drops
```

## Risks

- Silent sequence gaps because `SO_REUSEPORT` split the feed.
- Second “monitoring” process joins and changes IGMP leave timing when it exits.
- Binding the group address on an OS that still requires a separate join.

## Interview framing

“Port bind and group join are independent; multiple sockets on one port may share or shard multicast depending on `SO_REUSEPORT` and the kernel—always measure delivery per process.”

---
