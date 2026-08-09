# Misconception: Established Means Routing Works

## The myth

“BGP is Established, so traffic must be fine.”

## Why it is wrong

Established only means TCP + OPEN/Keepalive succeeded for that session. It does not prove:

- Any AFI exchanged NLRI.
- Import/export policy accepted prefixes.
- Best path installed in RIB/FIB.
- Next hop resolves.
- Forward and return paths work.
- Labels/VRF/EVPN state is programmed.

## Counterexamples

- Established with zero prefixes ([case](../24_Practical_Cases/01_Established_Session_Zero_Prefixes.md)).
- Best BGP path loses to static ([case](../24_Practical_Cases/11_Best_BGP_Route_Loses_to_Static.md)).
- IXP RS session up while fabric NH is down ([case](../24_Practical_Cases/10_Route_Server_Up_Data_Plane_Down.md)).
- GR stale blackhole with session still “up” from helper view ([case](../24_Practical_Cases/08_Graceful_Restart_Stale_Blackhole.md)).

## Correct habit

Walk [inspection order](../21_Operations_and_Observability/01_Operational_Inspection_Order.md) through advertised routes and bidirectional forwarding for the VIP prefix.

---
