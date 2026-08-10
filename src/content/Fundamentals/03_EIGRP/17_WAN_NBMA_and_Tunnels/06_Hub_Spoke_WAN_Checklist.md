# Hub-spoke WAN checklist

Use this as a pre-production and health-check list for EIGRP hub-and-spoke WANs (Serial, multipoint, DMVPN).

## Design

- [ ] Spokes configured as **EIGRP stub** (connected/summary as required)
- [ ] Hub sends **summary** or **default** toward spokes
- [ ] Query domain bounded (no full-table spokes)
- [ ] Prefer p2p subinterfaces / Phase design that matches route advertisement goals
- [ ] Split horizon policy documented if multipoint hub

## Metrics and pacing

- [ ] Tunnel/WAN `bandwidth` and `delay` set from design sheet
- [ ] `bandwidth-percent` reviewed on low-speed links
- [ ] QoS protects EIGRP / routing adjacency traffic

## Neighboring and security

- [ ] AS and K-values identical
- [ ] Auth key chains + rollover plan
- [ ] Passive on spoke LANs; not passive on tunnel
- [ ] Static neighbors if multicast NBMA requires them
- [ ] ACL/CoPP for protocol 88 where policy demands

## Redistribution

- [ ] Only planned redistribution points (usually hub/DC)
- [ ] Tags + prefix filters on mutual redistribution
- [ ] No accidental BGP full table into EIGRP

## Verification commands (hub)

```text
show ip eigrp neighbors
show ip eigrp topology summary
show ip route summary
show ip protocols
show dmvpn | show frame-relay pvc
```

## Verification commands (spoke)

```text
show ip eigrp neighbors
show ip protocols | include Stub
show ip route 0.0.0.0
ping / traceroute to remote site via hub
```

## Failure drills

| Drill | Expect |
|---|---|
| Primary hub link down | Converge to backup without SIA storm |
| Spoke LAN withdraw | Hub updates; other spokes not queried extensively |
| Auth key rotate | Neighbors stay up with overlap |

## Interview framing

“Hub-spoke EIGRP checklist: stubs at spokes, summaries at hub, correct tunnel metrics, auth, and bounded redistribution.”

## Exit criteria for go-live

All checklist boxes green on hub and on two sample spokes; controlled flap test with empty Active table; auth rollover rehearsed in lab.

## Related

- [Stub and Summary Together](../18_Scale_and_Design/03_Stub_and_Summary_Together.md)
- [DMVPN and Tunnel Notes](05_DMVPN_and_Tunnel_Notes.md)
- [Baseline Health Checks](../19_Operations_and_Observability/04_Baseline_Health_Checks.md)

---
