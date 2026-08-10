# MTU and fragmentation

Avoid IP fragmentation for market data and other sequenced multicast:

- one missing fragment loses the complete datagram;
- fragments may be filtered, reordered, or slow-pathed;
- reassembly costs state and latency on every hop that reassembles;
- IPv6 routers never fragment in transit;
- UDP has no TCP-like MSS negotiation.

Keep payload below the minimum path MTU after VLAN, MPLS, VXLAN, and GRE overhead. Verify actual frame sizes instead of trusting interface MTU alone.

## Sizing

```text
on-wire budget ≈ path_MTU - IP - UDP - app_header
```

Example (classic Ethernet 1500, IPv4+UDP, no tunnel):

```text
1500 - 20 - 8 = 1472 bytes UDP payload max without fragmentation
```

With QinQ, NVGRE, or VXLAN, subtract encapsulation. Document the **minimum** MTU along A and B feeds separately.

| Hazard | Effect |
|---|---|
| DF not set, oversize UDP | Fragments; silent loss of one fragment → gap |
| Middlebox fragment ACL | Blackhole |
| Different MTU on A vs B | One line fragments, arbitrator sees systematic gaps |
| Jumbo only on campus | WAN/cross-connect clamps → surprise fragments |

Related: [Application reliability](08_Application_Reliability.md), [TTL confusion](../16_Practical_Cases/09_TTL_Confusion.md).

## Configuration patterns

### Linux host

```text
ip link set dev eth0 mtu 9000
# Sender: clamp payload; do not rely on PMTUD for multicast
# Verify
ip -d link show eth0
tcpdump -ni eth0 -e -vv 'udp and dst host 232.10.10.10'
```

### Cisco — interface MTU / IP MTU

```text
interface GigabitEthernet0/1
 mtu 9216
 ip mtu 9000
```

### Junos

```text
set interfaces ge-0/0/1 mtu 9216
set interfaces ge-0/0/1 unit 0 family inet mtu 9000
```

Multicast does not run TCP MSS clamping; the application must enforce message size.

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIM / IGMP** | Unaffected directly; data plane still fragments |
| **Policers** | May count fragments oddly or drop non-initial fragments |
| **Capture** | First fragment only may match UDP port filters poorly |

## Verification

1. Capture full frames; confirm single IP packet per message (MF=0, offset=0).
2. Force oversize payload in lab; observe fragment pairs and app gaps.
3. Trace path MTU on both A/B underlays.
4. Confirm DF behavior if the stack sets it on UDP (platform-specific).

```text
tcpdump -ni eth0 -vv 'ip[6:2] & 0x1fff != 0'   # fragments
nstat -az | grep Frag
```

## Risks

- Designing messages at 1500 without VLAN/tunnel tax.
- Enabling jumbo on servers but not on every switch in the OIL.
- Treating “ping works” (small ICMP) as MTU proof for large UDP.

## Interview framing

“Fragmentation turns one lost fragment into a full multicast message gap with reassembly cost—size UDP payloads under the true path MTU end to end.”

---
