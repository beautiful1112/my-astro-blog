# Misconception: More BGP Peers Always Mean More Resilience

## The myth

“Adding more BGP peers always improves availability.”

## Why it is wrong

Extra peers can share the same fiber entry, MMR, upstream ASN, or IX fabric—correlated failure. They also increase policy surface (leaks, max-prefix events, RR path hiding complexity) and operational blast radius. A third peer that cannot carry N-1 traffic is theater, not resilience.

## What to inventory instead

- Diverse building entries and carriers.
- Independent upstream ASNs / backbones.
- Backup capacity ≥ expected N-1 load.
- Policy complexity budget (can on-call reason about it?).

Five sessions on one metro fiber are one failure domain.

## Correct habit

Count **failure domains and capacity**, not session count. Document diversity and validate backup bandwidth—see [Capacity and failure domains](../22_Quant_Trading_Networks/09_Capacity_and_Failure_Domains.md). Prefer two diverse, capacity-proven paths over five correlated ones.

---
