# Community-Based Policy Design

A maintainable community design separates **observation** (what is true about a route) from **action** (what the router should do). Tags are the API; LOCAL_PREF, accept/reject, MED, and prepends are the implementation.

## Recommended pipeline

1. **Import classify** — match peer/role/prefix/RPKI; add informational tags (source, trust, region).
2. **Translate** — map approved action tags (or classification) into LOCAL_PREF, export scope, prepend count, RTBH.
3. **Export** — permit only authorized NLRI; preserve, transform, or strip tags per trust boundary.
4. **Audit** — retain reason tags so `show` output explains *why* a preference exists.

```text
eBGP in → classify communities → set LOCAL_PREF → iBGP
iBGP / edge out → honor or strip → eBGP neighbors
```

## Design rules

| Rule | Why |
|---|---|
| Define who may set each tag | Prevent LP/blackhole injection |
| Distinct informational vs action namespaces | Avoid accidental triggers |
| Reject dangerous action communities from unauthorized peers | Security boundary |
| Prefer large communities for new 32-bit ASN APIs | Future-proof ([Large Communities](04_Large_Communities.md)) |
| Generate filters from a registry | Human-edited duplicates drift |
| Test missing, duplicate, and conflicting tags | Deterministic precedence |

## Configuration pattern (role-based)

### Cisco IOS / IOS XE (conceptual)

```text
! Informational: 65000:1xxx source class
! Action:       65000:2xxx requested LP / prepend (customers only)
ip community-list standard SRC-PEER permit 65000:1200
ip community-list standard ACT-LP200 permit 65000:2200
!
route-map FROM-PEER permit 10
 set community 65000:1200 additive
 set local-preference 200
!
route-map FROM-CUST permit 10
 match community ACT-LP200
 set local-preference 200
 set community 65000:1100 additive
route-map FROM-CUST permit 20
 set community 65000:1100 additive
 set local-preference 300
!
route-map TO-INTERNET permit 10
 set comm-list INTERNAL-ONLY delete
```

### Junos

```text
set policy-options community SRC-PEER members 65000:1200
set policy-options policy-statement FROM-PEER term 1 then community add SRC-PEER
set policy-options policy-statement FROM-PEER term 1 then local-preference 200
set policy-options policy-statement FROM-PEER term 1 then accept
set policy-options policy-statement TO-INTERNET term 1 then community delete INTERNAL-ONLY
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Valley-free export | Source tags drive export matrices ([Valley-Free Export](../11_Policy_and_Traffic_Engineering/05_Valley_Free_Export.md)) |
| Inbound TE | Provider action communities request LP/prepend remotely |
| ORF / max-prefix | Do not replace classification; they bound volume |
| RR | Must not strip tags needed for edge policy |

For trading or multi-region edges, tags can encode exchange region, carrier, circuit class, DDoS action, and maintenance state so incident response stays auditable.

## Verification

```text
show ip bgp community-list SRC-PEER
show ip bgp 192.0.2.0/24
! Expect both informational tag and resulting LocPrf
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
! Confirm stripped vs preserved communities
```

Conflict test: apply two action tags that request different LP values; document which wins (first-match route-map vs explicit priority community).

## Risks

- Single flat namespace where `65000:100` means three different things over time.
- Honoring customer action communities on peer sessions.
- Stripping reason tags before ops can debug.
- Policy order bugs: accept before classify.

## Interview framing

“Design communities as a versioned API: classify on import, translate to attributes centrally, strip at trust boundaries, and never honor unauthenticated action tags.”

---
