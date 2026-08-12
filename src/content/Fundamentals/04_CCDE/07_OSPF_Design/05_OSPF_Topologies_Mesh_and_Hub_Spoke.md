# OSPF mesh and hub-spoke

OSPF assumes **transitive L3 connectivity** in a broadcast or p2p network. Hub-and-spoke NBMA without care creates spokes that appear as transit or DR/BDR messes.

## Hub-spoke

- Point-to-point or point-to-multipoint; avoid broadcast mode on NBMA.
- Keep spokes from becoming transit (filters, stub areas, no unexpected virtual links).
- Dual hubs: both in area 0 or a WAN area with ABRs at hubs—not a virtual-link festival.

## Full mesh

Fine in a small core. In a large WAN, full-mesh OSPF adjacencies and LSAs hurt. Prefer a **BGP or overlay** for any-to-any and keep OSPF on the underlay limited.

## Internet edge

Do not flood the global table into OSPF. Originate a default or a handful of aggregates from the edge ASBR/ABR.

## Interview framing

“OSPF on hub-spoke is p2p/p2mp plus stubby spokes. A full-mesh IGP is for a small core, not for every branch pair.”

---
