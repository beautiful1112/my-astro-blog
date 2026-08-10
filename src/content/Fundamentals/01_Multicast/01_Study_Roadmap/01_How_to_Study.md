# How to study multicast

Use three passes, then keep a short lab notebook of failures you actually reproduced.

## Pass 1 — Mental model

Build the picture before CLI:

1. Packet path from source app to receiver app ([end-to-end path](../02_Mental_Model/04_End_to_End_Packet_Path.md)).
2. Three control planes: membership, L2 snooping, L3 PIM/RPF ([planes](../02_Mental_Model/02_Three_Control_Planes.md)).
3. ASM vs SSM and state notation (`(*,G)`, `(S,G)`, `(S,G,rpt)`).
4. Why RPF exists and how OIL is built.

## Pass 2 — Operations

Predict state, then verify:

1. Capture IGMP/MLD and PIM on a lab leaf.
2. Read `mroute` / RPF / snooping tables before changing config.
3. Localize loss with the [symptom matrix](../15_Troubleshooting/04_Symptom_Matrix.md).
4. Work [practical cases](../16_Practical_Cases/README.md) and [labs](../18_Labs/README.md) closed-book, then check.

## Pass 3 — Interview and design

1. Drill [interview questions](../17_Interview_Questions/README.md) aloud.
2. Use [memorization sheets](../19_Memorization/README.md) for numbers and the five-step narrative.
3. Design one small SSM market-data edge and one ASM RP edge; defend boundaries and A/B diversity.

## Invariant checklist

Whenever platform syntax differs, preserve the invariant being tested:

| Invariant | Typical evidence |
|---|---|
| Membership | IGMP/MLD group / source filter |
| L2 replication | snooping ports / mrouter |
| RPF | IIF and RPF neighbor |
| Tree state | `(*,G)` / `(S,G)` / flags |
| Forwarding | MFIB / wire counters |
| Application | sequence / gap recovery |

Prefer [config patterns](../14_Configuration_and_Observation/README.md) as recipes after you can draw the message flow without them.

## Interview framing

“I study multicast by plane—host, switch, router—then prove each with capture and state, not by memorizing vendor knobs first.”

---
