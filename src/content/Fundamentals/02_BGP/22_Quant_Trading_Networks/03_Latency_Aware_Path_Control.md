# Latency-Aware Path Control

AS_PATH length, IGP cost to next hop, and geographic distance are imperfect latency proxies. Measure what the strategy cares about, then map results into **stable policy classes**.

## Measure

- One-way latency (synced clocks where possible) and RTT.
- Jitter, loss, and queueing under load.
- Failover loss interval (not only “BGP reconverged”).
- Path asymmetry between order and market-data flows.

## Map measurements → BGP policy

| Measurement outcome | Policy lever |
|---|---|
| Path A consistently better for venue X | Higher LOCAL_PREF for prefixes learned via A |
| Equal LP needed across AS boundary | Consider [AIGP](../08_Path_Attributes/11_AIGP.md) inside a trusted backbone only |
| Dual circuits need capacity split | Multipath + [link-bandwidth](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md) |
| Backup only when primary gone | Large LP delta; avoid micro-optimizing on every sample |

Use hysteresis and minimum hold periods. Changing LOCAL_PREF on every 50 µs sample causes oscillation worse than a slightly suboptimal steady path.

## Config sketch

```text
route-map FROM-EXCHANGE-A permit 10
 match ip address prefix-list VENUE-A
 set local-preference 250
route-map FROM-EXCHANGE-B permit 10
 match ip address prefix-list VENUE-A
 set local-preference 200
```

## Verification

```text
show bgp ipv4 unicast <vip>
# Local Preference and next hop match the intended class
# Active probe confirms latency class, not only attribute win
```

Separate market-data ingestion, order entry, and bulk/recovery policies—their loss and churn tolerances differ ([MD vs order policy](06_Market_Data_vs_Order_Path_Policy.md)).

---
