# EIGRP versus OSPF versus IS-IS

Choose an IGP with eyes open: flooding model, metric philosophy, unequal-cost multipath, failure reaction (query vs SPF), multi-vendor reality, and PE-CE use differ sharply. EIGRP is not “OSPF with a Cisco accent.”

## Comparison table

| Dimension | EIGRP | OSPF | IS-IS |
|---|---|---|---|
| **Model** | Advanced DV + DUAL | Link-state (areas) | Link-state (levels) |
| **Flooding** | Partial Updates/Queries to neighbors | LSA flood in area | LSP flood in level |
| **Topology view** | Paths via neighbors | LSDB → SPF tree | LSDB → SPF tree |
| **Metric** | Composite (BW/delay…); wide metrics | Cost (typically ref-BW) | Wide/narrow metric |
| **UCMP** | **Variance** first-class | Generally ECMP only | Generally ECMP only |
| **Failure search** | FS cutover or **Query** domain | SPF on updated LSDB | SPF on updated LSDB |
| **Multi-vendor** | Weak (Cisco-primary; RFC 7868 info) | Strong | Strong (SP-heavy) |
| **PE-CE** | Seen on Cisco PE-CE | Very common | Less common at CE |
| **Stub/query bound** | EIGRP stub + summary | Stub/NSSA (different meaning) | Attach bit / leaking (different) |
| **Transport** | IP proto 88 + RTP | IP proto 89 | CLNS/ethertype (not IP) |

Related: [Why EIGRP exists](02_Why_EIGRP_Exists.md), [Advanced distance vector](03_Advanced_Distance_Vector.md).

## Mental model contrast

```text
EIGRP:  neighbor says "P via me at RD" -> DUAL -> maybe Query others
OSPF:   flood link state -> every router SPF -> converge on tree
IS-IS:  flood LSPs -> every router SPF -> converge on tree
```

```text
[EIGRP]
Neighbor updates --> DUAL
D --> Optional queries

[OSPF / IS-IS]
Flood LSDB --> SPF
```

## When interviews expect a crisp pick

| Scenario | Typical answer |
|---|---|
| Multi-vendor campus/core | OSPF (or IS-IS) |
| Cisco enterprise WAN wanting UCMP | EIGRP variance |
| SP underlay / large L2-less core | IS-IS often |
| Internet edge policy | BGP, not these |
| Fast backup without query | Ensure FS / summarization design (EIGRP) or LFA/TI-LFA (LS) |

## Configuration patterns (identity only)

### Cisco — EIGRP named

```text
router eigrp ENT
 address-family ipv4 unicast autonomous-system 100
  network 10.0.0.0 0.255.255.255
```

### Cisco — OSPF

```text
router ospf 1
 router-id 192.0.2.1
 network 10.0.0.0 0.255.255.255 area 0
```

### FRRouting — OSPF/IS-IS yes, EIGRP no (assume)

```text
router ospf
 ospf router-id 192.0.2.1
 network 10.0.0.0/8 area 0
```

FRR is fine for OSPF/IS-IS labs; do not expect Cisco-parity EIGRP.

## Verification angles

```text
show ip eigrp topology
show ip ospf database
show isis database
show ip route
```

Compare: one prefix’s next hop selection story under each protocol after the same link failure.

## Risks

- Equating OSPF stub area with EIGRP stub → wrong query expectations.
- Assuming EIGRP “floods less so always safer” → unbounded queries can be worse than SPF.
- Ignoring operational skill inventory (team knows OSPF) when selecting EIGRP for greenfield.

## Interview framing

“EIGRP reacts with DUAL successors/FS and queries over a DV topology; OSPF/IS-IS flood link state and run SPF—pick EIGRP for Cisco-centric UCMP and stub query design, pick OSPF/IS-IS for multi-vendor LSDB operations.”

---
