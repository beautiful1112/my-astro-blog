# Linux multicast inspection

Use the host as a first-class observation point: interface selection, membership, socket ownership, and drop counters often explain “network” incidents.

```bash
ip -br address
ip route get 192.0.2.10
ip -s link show dev eth0
ip maddr show dev eth0
cat /proc/net/igmp
cat /proc/net/igmp6
ss -uapn
tcpdump -ni eth0 -vv 'igmp or (udp and dst host 239.10.10.10 and dst port 15000)'
ethtool -S eth0
nstat -az
```

Related: [Socket operations](../11_Host_and_Application/02_Socket_Operations.md), [NIC path](../11_Host_and_Application/05_NIC_Receive_Path.md), [Define the flow](../15_Troubleshooting/01_Define_the_Flow.md).

## What each command answers

| Command | Question |
|---|---|
| `ip maddr` / `/proc/net/igmp` | Did the kernel join `G` on this if? |
| `ss -uapn` | Which process owns the UDP port? |
| `tcpdump … igmp` | Did a Report leave the host? |
| `tcpdump … udp` | Is data arriving at this NIC? |
| `ethtool -S` | Rings/DMA/missed drops? |
| `nstat` | IP/UDP/Rcvbuf errors rising? |
| `ip route get` | Unicast path to `S` (not full RPF proof on routers) |

## Configuration patterns

### One-shot membership + drop snapshot

```text
echo "=== $(date -Is) ==="
ip maddr show dev eth0
grep -A2 -E '239.10.10.10|232.10.10.10' /proc/net/igmp || true
ss -uapn | grep 15000 || true
nstat -az | egrep 'UdpInDatagrams|UdpRcvbufErrors|UdpInErrors|IpInDiscards'
ethtool -S eth0 | egrep -i 'drop|miss|buffer|error|fifo'
```

### SSM-focused capture

```text
tcpdump -ni eth0 -vv -tt \
  'igmp or (udp and src host 192.0.2.10 and dst host 232.10.10.10 and dst port 15000)'
```

### Namespace / container

```text
ip netns exec md-feed ip maddr show
ip netns exec md-feed cat /proc/net/igmp
ip netns exec md-feed ss -uapn
```

Joins in the wrong netns are a frequent false “network down.”

## Interactions

| Mechanism | Relationship |
|---|---|
| **Firewall** | `setsockopt` join OK while INPUT drops data/Reports |
| **VRF / VR** | Membership per table; check the VRF device |
| **Bypass** | DPDK/AF_XDP: these socket views may stay empty |

## Verification checklist

1. Correct interface address in `IP_ADD_MEMBERSHIP`.
2. Report on the wire after join.
3. Data frames present with expected TTL and size.
4. Drop counters flat while app sequences advance—or identify first riser.

## Risks

- Heavy `tcpdump` on the feed core inducing the gaps you are measuring.
- Trusting `ip route get` to a group address for multicast routing diagnosis.
- Ignoring that `/proc/net/igmp` can show a group while the NIC filter failed.

## Interview framing

“On Linux, prove join, Report, data, and drops separately with `igmp` proc/`ip maddr`, `tcpdump`, `ss`, `ethtool -S`, and `nstat`—before blaming the routers.”

---
