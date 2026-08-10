# NIC receive path

Multicast loss is often blamed on the network when the packet never reached the application. The host path has many drop points; each needs its own counter.

```text
wire -> PHY/MAC -> NIC multicast filter -> RX descriptor ring
     -> driver/NAPI -> kernel stack -> socket receive queue
     -> application read -> decoder/order book
```

A packet visible on an external TAP but absent from the application does not prove the network dropped it. Likewise, a normal OS capture may not see traffic consumed by kernel bypass (AF_XDP, DPDK, vendor stacks).

## Drop points

| Stage | Typical counters / symptoms |
|---|---|
| Multicast filter / imperfect hash | Group not programmed; wrong MAC alias |
| RX ring full | `rx_missed`, `rx_no_buffer`, FIFO errors |
| Driver / NAPI | Softirq starvation; rising backlog |
| IP / UDP | `InDiscards`, `UdpRcvbufErrors`, checksum fails |
| Socket queue | App not reading; `SO_RCVBUF` exhausted |
| Application | GC pause, lock, slow decoder—sequence gaps with quiet NIC |

Related: [Low-latency tuning](06_Low_Latency_Host_Tuning.md), [Capture sees data, app gaps](../16_Practical_Cases/06_Capture_Sees_Data_Application_Gaps.md).

## Multicast filter programming

After `IP_ADD_MEMBERSHIP`, the kernel programs the NIC (or falls back to promiscuous/allmulti). Failure modes:

- join on wrong interface → filter on wrong NIC;
- hash collision / imperfect filtering → extra groups delivered (app must discard);
- SR-IOV VF not syncing multicast list from the PF.

## Configuration patterns

### Linux inspection

```text
ip maddr show dev eth0
ethtool -S eth0 | egrep -i 'drop|miss|buffer|error|fifo'
cat /proc/net/softnet_stat
nstat -az | egrep 'Udp|IpIn|Rcvbuf'
ss -umn | grep 15000
```

### Ring and offload peek

```text
ethtool -g eth0
ethtool -k eth0
```

Disable GRO/LRO only when debugging capture vs application discrepancy; document the change.

## Interactions

| Mechanism | Relationship |
|---|---|
| **RSS** | One `(S,G)` often pins to one RX queue/CPU |
| **PTP / HW stamp** | Timestamp at MAC/NIC vs socket vs app |
| **Kernel bypass** | Path skips socket counters—use NIC/userland stats |
| **Bridge / veth** | Extra hop and filtering before the guest NIC |

## Verification

1. TAP or SPAN: sequences continuous.
2. Host `tcpdump` on `eth0`: same sequences (or explain bypass).
3. NIC stats flat during gap → look at socket/app.
4. NIC missed rising → rings, interrupt moderation, CPU.
5. App gap with quiet NIC and quiet UDP errors → decoder/scheduling.

```text
tcpdump -ni eth0 -tt 'udp and dst host 232.10.10.10'
ethtool -S eth0
```

## Risks

- Trusting only `tcpdump` on a busy host (drops in capture path).
- Ignoring multicast filter vs promiscuous differences after join flaps.
- Comparing HW timestamps to software timestamps without clock domain notes.

## Interview framing

“Wire presence only proves the network delivered to the NIC; rings, filters, sockets, and the application each have independent drop surfaces—walk the path with counters at every stage.”

---
