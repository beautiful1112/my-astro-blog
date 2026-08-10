# NBMA and multipoint

**NBMA** (non-broadcast multi-access) and multipoint tunnels share a broadcast-like subnet without reliable native multicast. EIGRP’s default multicast hello model breaks unless you use static neighbors or point-to-point mappings.

## Split horizon on multipoint

EIGRP split horizon: do not advertise a route out the interface it was learned on. On a **multipoint** hub interface, routes learned from Spoke-1 are not advertised out that same multipoint interface to Spoke-2.

```mermaid
flowchart LR
  S1["Spoke1 10.1.0.0/16"] -->|learn| H["Hub multipoint"]
  H -->|split horizon blocks| S2["Spoke2"]
```

Symptoms: spokes can reach hub LANs but not each other’s sites.

### Mitigations

| Approach | Notes |
|---|---|
| Point-to-point subinterfaces | Cleanest; SH works per P2P link |
| Disable split horizon on hub multipoint | `no ip split-horizon eigrp ASN` — allow spoke routes out; watch loops |
| Hub summary / default only | Spokes use default to hub; hub has specifics |
| DMVPN Phase 2/3 + NHRP | Data-plane shortcuts; still need control-plane reachability design |

## Next-hop behavior

On multipoint, the next-hop in updates may remain the originating spoke. If the receiving spoke has no dynamic mapping / resolution to that next-hop, traffic blackholes even when the route exists.

Point-to-point hub links rewrite next-hop to the hub address—simpler forwarding.

## Multicast vs unicast

| Mode | NBMA reality |
|---|---|
| Multicast 224.0.0.10 | Often broken without pseudo-broadcast / NHRP multicast mapping |
| Static neighbors | Unicast EIGRP — common fix |

## Configuration sketches

```text
! Hub multipoint — if you must stay multipoint
interface Tunnel0
 ip address 10.255.0.1 255.255.255.0
 no ip split-horizon eigrp 100
!
! Prefer instead: p2p tunnel or DVTI / Phase3 with summaries
```

## Verification

```text
show ip eigrp topology
! on spoke: is remote spoke prefix present?
show ip route 10.2.0.0
show frame-relay map
! or: show dmvpn / show ip nhrp
```

## Risks

- Disabling SH without summarization → suboptimal mesh of specifics + possible loops with redistribution.
- Fixing “missing spoke routes” with redistribute static hacks.

## Interview framing

“On multipoint hub interfaces, EIGRP split horizon hides spoke prefixes from other spokes—use p2p subinterfaces, disable SH deliberately, or advertise only defaults/summaries.”

## Related

- [Static Neighbors on NBMA](03_Static_Neighbors_on_NBMA.md)
- [Spoke Missing Routes case](../21_Practical_Cases/02_Spoke_Missing_Routes_Split_Horizon.md)
- [DMVPN and Tunnel Notes](05_DMVPN_and_Tunnel_Notes.md)

---
