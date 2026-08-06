# RP redundancy and failure modes

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

RP redundancy must solve three different problems. A design that solves only one can look redundant while new multicast flows still fail.

| Plane | Required outcome | Typical mechanisms |
|---|---|---|
| mapping | every router selects a usable RP for `G` | static policy, BSR, Auto-RP |
| reachability | Joins and Registers reach a live physical RP | IGP convergence, Anycast prefix, tracked route origination |
| source discovery/state | an RP serving receivers learns sources registered elsewhere | MSDP or RFC 4610 PIM Anycast-RP synchronization |

## Pattern 1: static primary and backup

Some platforms support ordered static RP mappings or fallback. This is easy to reason about only if selection rules are identical everywhere and failure detection changes the mapping. Merely configuring two different RPs for the same group can hash/load-share groups, prefer one by vendor-specific rules, or split FHR and LHR mappings.

Use explicit group scopes, consistent configuration automation, and a documented failover trigger. Test a silent RP process failure, not just loss of its route.

## Pattern 2: multiple candidate RPs through BSR

BSR advertises several RPs for a group range and routers deterministically map each group to one candidate. This distributes groups and provides remapping after a candidate expires.

It does **not** synchronize live source state between different RP addresses. When a group remaps, new RPT and registration/source state must be built at the replacement. Existing SPTs can hide the transition.

## Pattern 3: Anycast RP with MSDP

Multiple routers advertise one shared RP address; routing chooses a nearby member. MSDP between unique member addresses distributes active-source knowledge. This combines fast IGP reachability with source discovery across members, at the cost of MSDP session, SA-cache, peer-RPF, and filtering operations.

## Pattern 4: Anycast RP using PIM

The same shared-address reachability is used, but the receiving RP copies FHR Registers to every configured Anycast member. This removes internal MSDP sessions and SA messages. It requires a small, consistent member set and Register replication capacity.

## Failure timeline

For a physical Anycast member failure:

1. the shared RP route is withdrawn or the old route expires;
2. MRIB RPF toward the anycast address changes;
3. LHR `(*,G)` Join state moves/rebuilds toward the surviving member;
4. FHR Null/Data Registers reach the survivor;
5. synchronization supplies source knowledge if sources and receivers land on different members;
6. the survivor joins sources and programs RPT forwarding;
7. receivers that use SPT may switch/bypass again.

Loss can occur at any boundary. “The RP ping works” proves only part of step 1/2.

## What survives an RP outage

- established SPT forwarding may survive until unrelated state or topology changes;
- RPT-resident receivers depend directly on the failed RP tree;
- new receivers need a working mapping and shared-tree root;
- new ASM sources need working Register processing;
- sources suppressed by an old Register-Stop rely on Null-Register timeout/probe behavior to rediscover the survivor;
- interdomain receivers may also depend on MSDP SA recovery.

## Test plan

Run separate tests for:

1. established SPT stream;
2. established RPT-only stream;
3. receiver joining during failure;
4. source starting during failure;
5. source stopping and restarting after failure;
6. mapping-plane failure with RP forwarding intact;
7. synchronization failure with anycast reachability intact;
8. RP process failure while loopback/IGP remains up;
9. complete node/power failure; and
10. restoration, including duplicate or stale state.

Record convergence time, lost/duplicate sequences, selected mapping at FHR/LHR, physical anycast member, Register/SA state, Join path, and MFIB state. This exposes partial redundancy that a steady-state ping or one established feed cannot.
