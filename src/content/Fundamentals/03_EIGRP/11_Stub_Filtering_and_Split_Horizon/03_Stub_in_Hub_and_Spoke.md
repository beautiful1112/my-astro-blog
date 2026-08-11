# Stub in hub and spoke

Hub-and-spoke is the canonical EIGRP stub deployment: **spokes stub, hubs not stub**, hubs advertise summary or default toward spokes, spokes advertise local connected/summary only.

## Target information flow

```text
Spoke → Hub:  local connected (and allowed static/redistributed)
Hub → Spoke:  default route and/or regional summaries
Hub → Core:   summarized spoke space
```

Spokes should not learn full enterprise tables unless required. Hubs should not Query spokes for random remote prefixes.

```text
Core --> Hub1
C --> Hub2
H1 --> Spoke stub
H2 --> S1
H1 --> Spoke stub
```

## Dual-hub spoke

- Spoke neighbors both hubs; still stub.
- Ensure both hubs inject consistent default/summary.
- Avoid designs where spoke is expected to transit hub1↔hub2 traffic—stub prevents advertising learned hub routes to the other hub.

## Split horizon interaction

On **multipoint** NBMA/DMVPN-style interfaces, split horizon may block hub from reflecting spoke routes to other spokes. Hub may need `no ip split-horizon eigrp` (classic) / af-interface `no split-horizon` (named) **on the hub multipoint interface** so spoke-to-spoke through hub works. That is orthogonal to stub but almost always co-designed. See [Split horizon](06_Split_Horizon.md).

## Minimal classic spoke

```text
router eigrp 100
 network 10.1.0.0 0.0.255.255
 network 172.16.0.0 0.0.0.255
 eigrp stub connected summary
 no auto-summary
```

## Minimal hub notes

```text
router eigrp 100
 network 10.0.0.0 0.255.255.255
 no auto-summary
! interface toward core:
!  ip summary-address eigrp 100 10.1.0.0 255.255.0.0
! interface toward spokes: consider default-network / summary / ip summary-address
```

## Verification

```text
show ip eigrp neighbors detail   ! stub flags on spoke
show ip route                    ! spoke has default/summary only
show ip eigrp topology active    ! hub Active should not hang on spokes
```

## Interview framing

“Spokes stub + limited advertise; hubs summarize; multipoint hubs often disable split horizon. Dual-hub spokes still stub so they never transit between hubs.”

## Related

- [Stub options](02_Stub_Options.md)
- [Split horizon](06_Split_Horizon.md)
- [Designing the query domain](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)

---
