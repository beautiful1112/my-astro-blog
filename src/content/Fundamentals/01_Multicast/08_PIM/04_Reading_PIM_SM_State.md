# Reading PIM-SM state

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Multicast route output is a compressed view of several state machines. Flags and names vary by platform, so first identify the invariant: which tree the entry represents, its root, the expected incoming interface, and the reasons for every outgoing interface.

```text
(*, 239.10.10.10)
  RP 10.255.0.1, RPF neighbor Core1
  IIF: Port-Channel10
  OIL: Vlan200 (local membership), Port-Channel20 (PIM Join)

(192.0.2.10, 239.10.10.10)
  RPF neighbor Edge1
  IIF: Port-Channel30
  OIL: Vlan200
  SPT bit: set
```

## Read an entry in this order

1. **Identity:** VRF, address family, group `G`, and source `S` if present.
2. **Service model:** ASM, SSM, BIDIR, or another mode. An address inside the configured SSM range must not depend on an RP.
3. **State type:** `(*,G)`, `(S,G)`, or negative `(S,G,rpt)` state.
4. **Root and RPF:** RP for shared-tree state; source for source-tree state.
5. **IIF and RPF neighbor:** compare them with the MRIB, not only the ordinary unicast forwarding result.
6. **OIL reasons:** local IGMP/MLD membership, downstream PIM Join, inherited `(*,G)` interest, static state, or Assert outcome.
7. **Forwarding status:** SPT bit, RPT/SPT flags, Register state, prune/assert state, and whether the entry is actually installed in the MFIB.
8. **Evidence:** entry age, expiry timers, packets/bytes, rate, RPF drops, and per-interface counters.

## State semantics

### `(*,G)`

This is shared-tree interest for all allowed sources to `G`. Its upstream neighbor is selected toward `RP(G)`. Its OIL is the union of interested downstream interfaces, subject to prune, Assert, boundary, and policy state.

A valid `(*,G)` with a null OIL can be transient or control-only. It does not forward data to a receiver until some downstream/local interface is eligible.

### `(S,G)`

This is source-specific state whose upstream direction is normally toward `S`. It can exist because:

- an SSM receiver explicitly requested `(S,G)`;
- an ASM RP joined `S` to obtain native traffic;
- an ASM LHR switched to the SPT;
- the router is the FHR and has a directly connected active source; or
- static/policy state created it.

In ASM, a displayed `(S,G)` does not automatically mean the router has completed the SPT transition. Confirm the SPT bit and the actual IIF on which accepted data increments.

### `(S,G,rpt)`

This is per-source prune state relative to the RPT. It subtracts source `S` from interfaces that otherwise inherit `(*,G)` forwarding. It commonly appears after SPT switchover. Some CLIs show it as a flag or pruned OIF under `(S,G)` rather than as a separate route.

## OIL inheritance

The effective `(S,G)` outgoing list is not always printed as a simple independent list. Conceptually it can include downstream `(S,G)` joins and eligible interfaces inherited from `(*,G)`, minus:

- `(S,G,rpt)` prunes;
- Assert-loser interfaces;
- the incoming interface;
- administrative boundaries or filters; and
- interfaces whose state expired.

Therefore, ask **why** an interface is present or absent. Do not assume every OIF came from an explicit `(S,G)` Join.

## Common readings

| Observation | Meaning to test |
|---|---|
| `(*,G)` only | receiver tree exists but no source known here, or router remains RPT-only |
| `(S,G)` at FHR, no downstream OIL | source is active but there is no joined branch at this router |
| `(S,G)` at RP with Register flag | RP learned source through registration; verify native join and Register-Stop transition |
| `(S,G)` with SPT bit clear | source state exists, but acceptable source-tree data has not completed transition |
| correct route, zero counters | traffic has not arrived, is failing before lookup, or hardware counters are separate |
| rising RPF failures | packets arrive somewhere other than selected IIF/RPF neighbor |
| OIL contains IIF | platform should suppress same-interface replication unless local shared-LAN/Assert logic permits it; inspect topology |
| control state correct, hardware absent | MFIB programming/resource failure |

## Snapshot versus process

One command is only a snapshot. Capture the entry twice and correlate:

- entry age and expiry refresh;
- Join/Prune transmission and reception;
- input and output packet deltas;
- source rate and data-plane timestamps;
- MRIB next-hop changes;
- Assert winner changes; and
- hardware replication counters.

The strongest diagnosis explains both the current state **and the event that created it**.

