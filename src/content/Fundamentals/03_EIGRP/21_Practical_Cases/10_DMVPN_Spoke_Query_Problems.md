# Case: DMVPN spoke query problems

## Topology

```text
DMVPN Phase 2/3, 150 spokes
Spokes not stubby; hub sends full specifics (no summary)
Spoke-12 underlay flapping (IPsec rekey / ISP)
```

## Symptom

Each time Spoke-12 drops, hubs spike CPU and unrelated spokes show brief route holes. NHRP looks mostly fine; engineers chase IPsec. `topology active` lights up on hub for Spoke-12 LANs and other prefixes affected by cascading resets.

## Evidence

```text
show dmvpn
show ip nhrp
show ip eigrp neighbors detail
! Spoke-12 cycling; others lack stub
show ip eigrp topology active
show logging | include SIA|Tunnel
```

NHRP registrations recover, but EIGRP query blast is the blast radius amplifier.

## Root cause

Overlay routing without **stub + summary** turns underlay flaps into AS-wide Active/SIA risk. DMVPN shortcuts do not replace query-domain design.

## Fix

```text
! all spokes
router eigrp 100
 eigrp stub connected summary
!
! hub
interface Tunnel0
 bandwidth 10000
 delay 1000
 ip summary-address eigrp 100 0.0.0.0 0.0.0.0
! decide SH policy for spoke-spoke specifics
```

Stabilize Spoke-12 underlay separately (ISP/IPsec). Confirm active tables stay empty during spoke bounce tests.

## Interview takeaway

“On DMVPN, treat EIGRP stub/summary as mandatory; NHRP health ≠ query-domain safety.”

## Phase note

Phase 3 redirects help data plane; they do not stub the control plane. Still configure `eigrp stub` on spokes regardless of DMVPN phase.

## Related

- [DMVPN and Tunnel Notes](../17_WAN_NBMA_and_Tunnels/05_DMVPN_and_Tunnel_Notes.md)
- [SIA Storm Without Stub](03_SIA_Storm_Without_Stub.md)

---
