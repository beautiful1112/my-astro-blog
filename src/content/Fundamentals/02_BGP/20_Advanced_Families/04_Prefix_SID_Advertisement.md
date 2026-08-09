# BGP Prefix-SID Advertisement

The **BGP Prefix-SID** attribute advertises Segment Routing information associated with a BGP prefix (SR-MPLS index/label or related forms). It supports SR in interdomain or service designs where IGP flooding alone is insufficient.

## What it does and does not do

| Does | Does not |
|---|---|
| Attach SID/index semantics to a prefix | Magically install reachability without BGP best path + NH |
| Aid SR-MPLS label computation | Replace LDP/IGP everywhere automatically |
| Support multi-domain SR stitching designs | Fix conflicting SID allocations |

The route still needs normal BGP selection and next-hop resolution. Prefix-SID supplies **label/index behavior**.

## Consistency checks

| Check | Failure mode |
|---|---|
| Prefix ↔ SID mapping unique | Wrong endpoint |
| SRGB / absolute label semantics | Label mishit |
| Domain boundaries | SID not understood downstream |
| Next-hop transport | Unlabeled path only |
| Hardware programming | Control plane SID, no FIB |

## Configuration sketch

```text
router bgp 65000
 address-family ipv4 unicast
  segment-routing mpls
 neighbor 192.0.2.1
  address-family ipv4 labeled-unicast
   ! Prefix-SID attached per platform policy
```

```text
set policy-options policy-statement EXPORT-SID then prefix-segment index 100
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **BGP LU** | Often carries labeled prefixes with SIDs |
| **SR Policy** | Uses SIDs in segment lists |
| **AIGP** | Path metric across SR domains |

## Verification

```text
show bgp ipv4 unicast <prefix> detail
! Prefix-SID attribute
show mpls label table
show segment-routing mapping-server
```

## Interview framing

“BGP Prefix-SID associates SR label/index info with a prefix; reachability still depends on BGP next-hop and transport—SID conflicts forward to the wrong place.”

---
