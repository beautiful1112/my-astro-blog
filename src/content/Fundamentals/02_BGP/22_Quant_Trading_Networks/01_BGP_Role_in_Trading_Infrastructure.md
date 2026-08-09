# BGP's Role in Quantitative-Trading Infrastructure

BGP commonly appears at Internet and DDoS-provider edges, private exchange/broker/market-data interconnects, WAN and cloud on-ramps, data-center EVPN fabrics, MPLS/VPN segmentation, and anycast support services.

BGP chooses **policy-compliant reachability**. It does not natively optimize exchange-to-strategy latency, fill probability, or market-data gap rate. Those outcomes come from how you map business intent into attributes, communities, and verification.

## Design translation

| Business intent | BGP / policy expression |
|---|---|
| Prefer venue A over venue B | Distinct LOCAL_PREF (or community→LP) classes; equal AS_PATH within class |
| Deterministic failover | Pre-staged backup with known LP delta; BFD/PIC where justified |
| No Internet transit for order VIP | Strict export; OTC/roles; prefix allowlists |
| Segment MD vs orders | Separate VRFs / RTs / communities; distinct monitoring |
| Capacity-aware ECMP on dual circuits | Multipath + [link-bandwidth](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md) |

## What BGP will not do for you

- Guarantee one-way latency or jitter targets.
- Keep forward and reverse paths symmetric.
- Prove data-plane health without active probes.
- Prevent leaks solely via RPKI Valid.

## Typical policy stack (edge)

```text
Internet peers/transit:  RPKI reject Invalid + max-prefix + strict export
Exchange / broker:       high LP for venue prefixes; tiny allowlists
Backup transit:          low LP; capacity-checked for N-1 only
Internal iBGP/RR:        next-hop-self; ADD-PATH for VIP diversity if needed
```

Verification is continuous: best-path monitors, FIB checks, and active probes per VIP class—not only after changes.

A good trading design states VIP prefixes, primary/backup exits, abort thresholds, and continuous data-plane checks—see [Change Control and Evidence](10_Change_Control_and_Evidence.md).

## Related reading in this track

- [External connectivity](02_External_Connectivity_Design.md)
- [Latency-aware path control](03_Latency_Aware_Path_Control.md)
- [MD vs order policy](06_Market_Data_vs_Order_Path_Policy.md)

---
