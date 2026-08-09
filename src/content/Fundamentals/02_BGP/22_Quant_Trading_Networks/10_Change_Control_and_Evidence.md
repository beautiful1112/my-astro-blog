# Change Control and Evidence for Critical BGP Paths

A trading-network change is complete only when control-plane state, hardware forwarding, and service measurements agree with intent—not when the commit succeeds.

## Change record must include

- Exact peers, families, prefixes, and policies (diff attached).
- Expected best-path and advertisement deltas for VIP prefixes.
- Pre/post route snapshots (attributes: LP, AS_PATH, AIGP, communities, SoO).
- Traffic, loss, latency, and FIB evidence.
- External route visibility where relevant (looking glass / collector).
- Rollback conditions and exact rollback commands.
- Market-calendar risk window and abort thresholds.

## Soft-change preference

```text
# Apply route-map change, then:
clear bgp ipv4 unicast <peer> soft in
clear bgp ipv4 unicast <peer> soft out
# Avoid clear bgp * unless session state itself is wrong
```

## Evidence checklist

| Layer | Pass criteria |
|---|---|
| Session | Established; prefix counts within predicted band |
| Path | VIP best path matches intent |
| FIB | CEF/FT next hop and (if any) weights correct |
| Service | Loss/latency within abort thresholds |
| External | Advertisements visible as intended |

For PE-CE migrations involving `allowas-in` / `as-override` / SoO, require explicit loop-prevention proof before market open—see [PE-CE AS Loop Toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md).

## Ops note

Record the intended LOCAL_PREF / community class for each VIP in the same repo as the configs so on-call does not reverse-engineer intent from live attributes alone.

---
