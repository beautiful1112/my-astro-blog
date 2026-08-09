# Misconception: RPKI Valid Means Safe

## The myth

“If the route is RPKI Valid, it is safe to accept and advertise everywhere.”

## Why it is wrong

Valid only means a ROA authorizes that prefix/origin/length. The path can still be a **leak**, a suboptimal backdoor, or a capacity bomb. Valid routes still need export policy, max-prefix, and often OTC/roles. Invalid rejection is necessary but not sufficient for a safe edge.

maxLength mistakes also show that “we have a ROA” does not mean every more-specific you announce will be Valid.

## Quick counterexample

Customer exports provider-A table to provider-B. Origins remain Valid. You become transit; CPUs melt. RPKI did not warn.

## Correct habit

Treat RPKI as origin hygiene layered with leak prevention and classic filters—see [RPKI ≠ leaks interview](../25_Interview_Questions/07_RPKI_Does_Not_Stop_Leaks.md) and [memory card](../27_Memorization/04_RPKI_and_Leak_Memory_Card.md).

---
