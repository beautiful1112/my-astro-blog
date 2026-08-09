# BGP Advertisement of Segment-Routing Policies

BGP can distribute **Segment Routing Policy** candidates: an **endpoint + color** identifies intent, while attributes carry candidate paths and segment lists. **RFC 9830** (2025) is the current BGP advertisement specification for SR Policies.

## Intent model

```text
Service route colored with community/extcommunity COLOR=100
        ↓ resolve
SR Policy to endpoint PE with color 100
        ↓
Segment list (SID stack / SRv6) installed in FIB
```

This separates **service intent** from plain IGP shortest path and supports centralized or distributed TE.

## Validate checklist

| Item | Why |
|---|---|
| SR Policy SAFI capability | Family negotiated |
| Color + endpoint match | Policy selected for service |
| Candidate-path preference | Which path wins |
| Segment-list validity | SIDs exist / reachable |
| Binding SID | Midpoint steering |
| Unreachable segment behavior | Drop vs fallback |

## Configuration sketch

```text
! head-end learns policy via BGP SR Policy AF
router bgp 65000
 address-family ipv4 sr-policy
  neighbor 192.0.2.10 activate
```

Service color:

```text
route-policy COLOR-100
  set extcommunity color 100
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **BGP CAR** | Related color-aware transport—[08](08_BGP_Color_Aware_Routing.md) |
| **Prefix-SID** | SR identity on prefixes—[04](04_Prefix_SID_Advertisement.md) |
| **AIGP** | Alternate metric idea across domains—[AIGP](../08_Path_Attributes/11_AIGP.md) |
| **BGP-LS** | Topology input to controllers that compute policies |

## Verification

```text
show segment-routing traffic-eng policy
show bgp ipv4 sr-policy
traceroute with color / binding SID checks
```

## Interview framing

“BGP SR Policy advertises colored candidate paths with segment lists so heads can steer traffic by intent; validate color/endpoint match and SID reachability, not just BGP session state.”

---
