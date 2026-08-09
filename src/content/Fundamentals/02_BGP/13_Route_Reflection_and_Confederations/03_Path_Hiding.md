# Route-Reflector Path Hiding

An RR normally advertises only its **selected best path** for each NLRI. Clients therefore may never learn an alternative that would be best (or even usable) from the **client’s** IGP location or policy. That missing alternative is **path hiding**.

## Why it happens

```text
PE-West -- low IGP cost -- RR -- high IGP cost -- PE-East
                |
             Client-East
```

Both PE-West and PE-East advertise `10.0.0.0/8` to the RR. The RR’s IGP prefers PE-West and reflects only that path. Client-East would have preferred PE-East (hot-potato / local exit) but never sees it.

## Consequences

| Impact | Detail |
|---|---|
| Suboptimal exit | Traffic trombones to a distant PE |
| Lost ECMP / UCMP | Only one next hop installed |
| Slower failover | Backup not pre-programmed in FIB |
| Policy blindness | LOCAL_PREF/MED diversity invisible to clients |
| Latency-sensitive edges | Low-latency path may be hidden from trading/edge routers |

## Detection

On the RR:

```text
show bgp ipv4 unicast <prefix>
! Multiple paths present; only best marked *
```

On the client:

```text
show bgp ipv4 unicast <prefix>
! Often a single path — compare with RR’s multipath set
```

If the RR has N paths and the client has 1 (without ADD-PATH), hiding is in play. Also compare `show ip route` next hops after a PE failure: cold failover implies no backup path was advertised.

## Mitigations

| Tool | Effect | Cost |
|---|---|---|
| **ADD-PATH** | Advertise best + backup (or more) | Memory, UPDATE volume |
| Diverse RR placement / ORR | RR picks paths closer to client topology | Design complexity |
| Multiple RR clusters | Different viewpoints | More sessions |
| Shadow RR + selective mesh | Extra diversity for critical prefixes | Operational overhead |
| Disable reflection for a family | Full mesh that family only | Scale limits |

ADD-PATH is the usual modern fix for VPNv4/EVPN/Internet edge where backup paths matter. See [BGP ADD-PATH](05_ADD_PATH.md).

## Interactions

| Mechanism | Relationship |
|---|---|
| **Best-path algorithm** | Hiding is a direct result of advertising only the winner |
| **Multipath** | Client multipath cannot form on paths the RR never sent |
| **PIC / FRR** | Needs alternate BGP next hops in RIB/FIB—hiding removes them |
| **Graceful Restart** | Restores *known* paths; cannot invent hidden ones |
| **AIGP** | [AIGP](../08_Path_Attributes/11_AIGP.md) can change which path the RR prefers, but still only one unless ADD-PATH |

## Design rules

- Treat path hiding as a **first-class risk** in any RR design review, not an edge case.
- For L3VPN dual-homed CEs and EVPN multihoming, plan ADD-PATH or equivalent diversity explicitly.
- When troubleshooting “best BGP path loses to expectation,” dump **all paths on the RR**, not only the client RIB.
- Document which families use ADD-PATH send/receive and the send-path selection mode (best-plus-N, all, group-best).

## Interview framing

“Path hiding means the RR only reflects its best path, so clients may never learn an alternate that would be optimal from their location; ADD-PATH or careful RR placement restores diversity.”

---
