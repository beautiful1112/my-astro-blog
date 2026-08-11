# WAN design challenges

EIGRP over WAN differs from LAN cores: lower bandwidth, NBMA semantics, hub-spoke policy, and query scope dominate failure modes.

## Challenge map

| Challenge | EIGRP impact |
|---|---|
| Low bandwidth | Pacing / `bandwidth-percent`; hello loss under congestion |
| Hub-spoke | Split horizon blocks spoke-spoke routes; need summary/default |
| Multipoint NBMA | Multicast unreliable; next-hop retention issues |
| Dual-homed spokes | Variance/FC subtleties; stub critical |
| Tunnels (GRE/DMVPN/IPsec) | Logical BW/delay often wrong; NHRP dynamics |
| Large query domain | SIA when spoke/WAN links flap |

```text
Hub --> Spoke1
H --> Spoke2
S1 -. "no direct L3" .-> S2
```

Spoke-to-spoke traffic often goes hub-hairpin at Layer 3 even if DMVPN builds a shortcut tunnel—control plane design must still advertise reachability correctly.

## Design goals

1. Bound query scope: **stub** at spokes + **summaries** at hubs.
2. Correct **bandwidth** and **delay** on tunnel/WAN interfaces (metrics).
3. Prefer **point-to-point** subinterfaces over multipoint when possible.
4. Authenticate WAN EIGRP; passive on spoke LANs.
5. Pace EIGRP on low-speed links.

## Anti-patterns

- Full mesh EIGRP queries across hundreds of non-stub spokes.
- Leaving tunnel `bandwidth` at default 9 kbps / wrong defaults → metric explosion.
- Disabling split horizon casually without understanding duplicate paths.
- Redistributing BGP↔EIGRP at every spoke.

## Interview framing

“WAN EIGRP succeeds when stubs and summaries shrink queries, metrics reflect real path cost, and NBMA/tunnel next-hop behavior is explicit.”

## Metric hygiene on WAN

| Interface type | Set explicitly |
|---|---|
| GRE/mGRE tunnel | `bandwidth`, `delay` |
| Serial / ATM legacy | CIR-aligned `bandwidth` |
| Subinterface | Delay relative to peers |
| Port-channel WAN | Understand what EIGRP sees |

Wrong metrics create false successors and hide feasible backups ([Unexpected Metrics](../20_Troubleshooting/07_Unexpected_Metrics.md)).

## Query-domain reminder

Every WAN design review ends with two questions: Are spokes stub? Does the hub summarize or default? If either answer is no, scale risk is open.

## Verification snapshot

```text
show ip eigrp neighbors detail
show ip protocols | include Stub
show interface Tunnel0 | include BW|Dly
show ip eigrp topology summary
```

## Related

- [NBMA and Multipoint](02_NBMA_and_Multipoint.md)
- [Query Domain Architecture](../18_Scale_and_Design/02_Query_Domain_Architecture.md)
- [DMVPN and Tunnel Notes](05_DMVPN_and_Tunnel_Notes.md)

---
