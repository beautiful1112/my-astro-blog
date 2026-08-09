# Link Bandwidth Extended Community

The link-bandwidth extended community (often called **DMZ link bandwidth**) signals the bandwidth of an external link so multipath-capable BGP speakers can build **unequal-cost load balancing** across eBGP paths. It is carried as an extended community and interpreted by platforms that implement bandwidth-aware BGP multipath (historical Cisco “dmzlink-bw” model; similar ideas exist elsewhere).

## Problem

Ordinary BGP multipath treats eligible paths as equal. Two eBGP links—one 100G and one 10G—would each get ~50% of ECMP flows unless another layer (IGP unequal cost, SR TE, or weighted ECMP from another signal) intervenes. Link-bandwidth lets BGP multipath weight forwarding by advertised capacity.

## Mechanism (conceptual)

1. On the PE/edge facing unequal links, BGP attaches a link-bandwidth extended community derived from interface bandwidth or explicit configuration when advertising (or when accepting) the path.
2. Downstream iBGP speakers that support the feature and have multipath enabled install multiple paths with **load-balancing weights** proportional to bandwidth values.
3. Without multipath, the community is informational only; a single best path still wins.

Exact community encoding uses a non-transitive extended community type; treat vendor documentation as authoritative for the bit layout and units (bytes/sec vs bits/sec mistakes are common).

## Configuration pattern (Cisco-style)

```text
router bgp 65000
 neighbor 203.0.113.1 remote-as 64496
 neighbor 203.0.113.5 remote-as 64496
 !
 address-family ipv4
  bgp dmzlink-bw
  neighbor 203.0.113.1 activate
  neighbor 203.0.113.1 dmzlink-bw
  neighbor 203.0.113.5 activate
  neighbor 203.0.113.5 dmzlink-bw
  maximum-paths 4
 exit-address-family
```

For iBGP propagation of unequal weights toward the core, the feature must be enabled consistently on reflectors/clients so the community is preserved and multipath interprets it.

## Interactions

| Feature | Interaction |
|---|---|
| **Multipath** | Required; bandwidth community without multipath does not split traffic. |
| **ADD-PATH** | Helps RR clients learn multiple external paths that carry different bandwidth values. |
| **AIGP / IGP metric** | Different problem (interior cost). Do not assume bandwidth community affects AIGP. |
| **MED** | Still an attribute for entry preference across multi-exit; not a substitute for weighted ECMP. |
| **Hash polarization** | Weighted ECMP still depends on data-plane hash; elephant flows may under-utilize the fat link. |

## Verification

```text
show bgp ipv4 unicast <prefix>
show ip route <prefix>
show cef <prefix> detail
```

Confirm:

1. Multiple paths installed.
2. Weights/shares match the 100G vs 10G ratio within platform granularity.
3. Pulling the 100G link shifts traffic ratios rather than only removing one ECMP member incorrectly.

## Risks and limits

- Bandwidth is **configured/signaled capacity**, not measured available throughput.
- Oversubscription and QoS are invisible to the community.
- Mixing vendors in one multipath domain often fails closed (community ignored) or behaves inconsistently—lab the pair.
- Inflating bandwidth values is a traffic-steering attack inside a trust domain; restrict who may send the community.
- Ordinary equal-cost multipath rules still apply unless the platform’s link-bandwidth/UCPM feature is enabled—see [BGP Multipath and ECMP](../10_Best_Path/07_Multipath_and_ECMP.md).

## Interview framing

“Link-bandwidth extended communities tag path capacity so BGP multipath can weight ECMP across unequal eBGP links; without multipath support they do nothing, and they signal configured bandwidth—not real-time congestion.”

---
