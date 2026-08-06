# PIM Bootstrap Router complete process

The PIM Bootstrap Router mechanism dynamically distributes group-to-RP mappings inside a PIM domain. It has two distinct elections: one router becomes the BSR, while one or more candidate RPs advertise the group ranges they can serve.

## Roles

| Role | Function |
|---|---|
| Candidate BSR (C-BSR) | competes to originate Bootstrap messages for a scope zone |
| Elected BSR | collects candidate-RP advertisements, creates RP-set, floods it |
| Candidate RP (C-RP) | unicasts its RP address, priority, holdtime, and group prefixes to BSR |
| Ordinary PIM router | forwards Bootstrap messages and independently chooses `RP(G)` |

The BSR distributes information; it does not have to be an RP or carry user multicast data.

## Phase 1: BSR election

Candidate BSRs originate Bootstrap messages (BSMs). The election weight is:

1. **highest numeric BSR priority**;
2. highest BSR address as tie-breaker.

Routers store the current winner and forward its BSMs hop by hop on PIM-enabled interfaces within the applicable scope zone. Because forwarding is hop-by-hop rather than ordinary dense multicast data delivery, BSR can bootstrap a sparse-mode domain.

On winner expiry, another candidate begins advertising. Election convergence and the persistence of the previously learned RP-set are related but separate timers.

## Phase 2: candidate-RP advertisement

Each C-RP learns the elected BSR address from BSMs and unicasts Candidate-RP-Advertisement messages to it. The advertisement includes:

- candidate RP address;
- RP priority, where **lower numeric is preferred**;
- holdtime; and
- one or more group prefixes, or a default group range depending on implementation/configuration.

The BSR stores valid candidates in its candidate RP set. A zero holdtime withdraws a mapping; otherwise missing refresh eventually expires it.

## Phase 3: RP-set distribution

The elected BSR places group-to-RP mappings into BSMs and floods them through the PIM domain. A large RP-set can be split across semantic fragments. Routers use the fragment tag and common BSR/hash fields to build a consistent set.

Filtering or losing some fragments can create incomplete mappings even when the router still reports the correct BSR.

## Phase 4: deterministic RP selection

For group `G`, each router applies the same algorithm:

1. choose the longest matching advertised group prefix;
2. retain candidates at the best (lowest numeric) RP priority;
3. mask `G` using the advertised hash-mask length;
4. hash the masked group with each candidate RP address;
5. select the highest hash result;
6. use the highest RP address as final tie-breaker.

The RFC recommends hash-mask length 30 for IPv4 and 126 for IPv6. Groups that differ outside the masked high-order bits deliberately tend to stay on the same RP, improving aggregation. The function distributes **groups**, not packets or individual sources.

## Failover behavior

### BSR fails

A new BSR is elected after expiry/election processing. Routers may retain previously learned mappings until their mapping timers expire, so BSR failure need not immediately stop the data plane. New or refreshed RP-set distribution must still recover before mappings age out.

### Candidate RP fails

Its advertisement expires or is withdrawn. The next BSM RP-set omits it, and routers recalculate `RP(G)`. Shared trees and registration move only after the new mapping and RPF state are installed; established SPT traffic may continue meanwhile.

### Path partitions

Different partitions can temporarily elect different BSRs and learn different RP-sets. When connectivity returns, election rules converge on the higher-weight BSR, but tree state must rebuild. Administrative scope boundaries must intentionally contain BSMs; an accidental boundary produces similar symptoms.

## Security and operations

- permit only intended C-BSR and C-RP addresses;
- scope Bootstrap messages to the multicast administrative domain;
- monitor elected BSR changes, RP-set changes, fragment completeness, and mapping expiry;
- keep C-BSR and C-RP loopbacks reachable in the MRIB;
- confirm identical mapping on FHR, LHR, transit routers, and RP;
- test both BSR loss and RP loss—one does not prove the other.

Useful checks ask four separate questions: who is BSR, which candidates reached it, which RP-set it advertised, and which RP the local router selected for the exact group.
