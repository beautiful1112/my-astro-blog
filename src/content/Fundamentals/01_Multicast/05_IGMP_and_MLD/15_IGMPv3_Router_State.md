# IGMPv3 router-side listener state

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

An IGMPv3 router aggregates all host reports on a link into one conceptual record per group:

**(multicast address, group timer, filter mode, source records)**

Each source record has a source address and source timer.

## INCLUDE router state

**INCLUDE(A)** means A is the set of sources requested by at least one listener on the link. Traffic from sources not in A is not required on that link.

Each source timer confirms continuing demand. When a source timer expires and no listener refreshes it, the source can be removed.

## EXCLUDE router state

The router enters EXCLUDE mode if at least one listener reports EXCLUDE mode. This is needed because at least one listener wants almost all sources.

The group timer tracks the continuing presence of EXCLUDE-mode listeners. When it expires, the router can return to INCLUDE mode while retaining any sources still positively requested.

Router implementations may internally distinguish:

- Sources that must be forwarded because some listener wants them.
- Sources that EXCLUDE listeners request to block.

The compact CLI display can hide those timer distinctions.

## Leave/source-block verification

A state-change record does not prove that no other listener wants the group/source. The querier:

1. Lowers relevant group/source timers.
2. Sends Group-Specific or Group-and-Source-Specific Queries.
3. Retransmits according to the last-member count.
4. Retains state if another listener answers.
5. Removes state only when the verification window expires unanswered.

This is the source-aware generalization of IGMPv2 last-member processing.

Primary reference: [RFC 3376, Sections 6.2–6.6](https://www.rfc-editor.org/rfc/rfc3376.html#section-6.2).

