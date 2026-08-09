# BGP Link-State

**BGP-LS** exports link-state and traffic-engineering topology from IGP domains to consumers such as controllers, analytics, and path-computation elements. **RFC 9552** is the current base specification (obsoletes RFC 7752).

## What it carries

| Object class | Examples |
|---|---|
| Nodes | Router IDs, capabilities |
| Links | Neighbors, metrics, TE bandwidth, SRLG |
| Prefixes | IGP prefixes attached to nodes |
| Extensions | SR SIDs, attributes for PCE use |

BGP-LS NLRI are **topology objects**, not ordinary “install this destination in inet.0” Internet routes. Consumers build a TED/graph.

## Typical session design

```text
ABR / ASBR / RR reflects BGP-LS
        →
PCE / controller / collector (dedicated peers)
```

Use dedicated groups, policy, and often a separate RR mesh. **Never** advertise BGP-LS to ordinary Internet eBGP peers.

## Configuration sketch

```text
router bgp 65000
 address-family link-state link-state
  neighbor 192.0.2.100 activate
```

```text
set protocols bgp group PCE family traffic-engineering
```

Exact family names vary (`link-state`, `traffic-engineering`).

## Security and scale

- Topology is sensitive (map of your network).
- NLRI volume can be large with SR/TE attributes.
- Filter which domains/areas are exported.
- Authenticate sessions (TCP-AO/MD5) and ACL collectors.

## Interactions

| Mechanism | Relationship |
|---|---|
| **SR Policy / PCE** | Consumers of topology |
| **BGP-LS SPF** | Experimental on-box SPF—[09](09_BGP_LS_SPF_Routing.md) |
| **BMP** | Monitoring of BGP, not a TED substitute |

## Verification

```text
show bgp link-state status
show bgp link-state link
show bgp link-state node
```

## Interview framing

“BGP-LS exports IGP topology to controllers over MP-BGP; it is not Internet routing—keep it on dedicated peers and treat the data as sensitive.”

---
