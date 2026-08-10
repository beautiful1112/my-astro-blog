# Five-step interview narrative

When asked how multicast works, answer in five beats—then stop and offer to go deeper on any one plane.

1. A sender transmits one **best-effort** packet to group `G`; it need not join. It chooses egress interface and TTL/Hop Limit.
2. A receiver joins locally with **IGMP/MLD**, possibly specifying source `S` (SSM). The last-hop router learns local interest.
3. **Snooping** constrains Layer-2 copies to listener and mrouter ports (or floods if snooping is off / state missing).
4. **PIM** builds routed state toward `S` or the RP; **RPF** validates the source (or RP) direction; routers replicate only on the effective OIL.
5. **UDP applications** handle ordering, loss, duplication, and recovery—especially important for market data (A/B feeds, gap fill, sequencing).

## One-line variants

| Prompt | Compress to |
|---|---|
| “Explain multicast” | Interest up, data down; three planes; best-effort fan-out |
| “ASM vs SSM” | ASM meets at RP; SSM joins `(S,G)` straight to the source |
| “Why did it break?” | Name the plane first, then the state that proves it |

## Cross-links

[What multicast is](../02_Mental_Model/01_What_Multicast_Is.md), [Receiver-driven signaling](../02_Mental_Model/03_Receiver_Driven_Signaling.md), [ASM and SSM](../03_Service_Models_and_Terminology/02_ASM_and_SSM.md), [One-sentence recall](02_One_Sentence_Recall.md).

## Interview framing

“Sender sends once to G; receiver joins; snooping and PIM build the tree; RPF keeps it loop-free; the app owns reliability.”

---
