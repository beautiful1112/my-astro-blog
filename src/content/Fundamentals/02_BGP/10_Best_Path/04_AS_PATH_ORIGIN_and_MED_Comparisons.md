# AS_PATH, ORIGIN, and MED Comparisons

After high-priority local policy (weight / LOCAL_PREF / local origination), common algorithms compare:

1. **Shorter AS_PATH**
2. **Lower ORIGIN** — IGP, then EGP, then INCOMPLETE
3. **Lower MED** — normally only among paths from the **same** neighboring AS

These are lexicographic. A path that wins on AS_PATH never loses to a better ORIGIN or MED on another path.

## AS_PATH details

| Topic | Behavior |
|---|---|
| AS_SEQUENCE | Each ASN counts |
| AS_SET | Entire set traditionally counts as one |
| Confederation segments | Usually ignored for external length |
| Prepending | Inflates length intentionally ([Prepending](../08_Path_Attributes/04_AS_Path_Prepending.md)) |
| Four-octet / AS_TRANS | Compare reconstructed path, not raw 23456 artifacts |

Some platforms can ignore certain ASNs when counting (rare inbound features)—document if used.

## ORIGIN details

See [ORIGIN](../08_Path_Attributes/02_ORIGIN.md). Weak TE tool; still decisive when LP and AS_PATH tie in redistribution-heavy networks.

## MED details

See [MED](../08_Path_Attributes/08_MED.md).

| Knob | Effect |
|---|---|
| always-compare-med | Compare MED across different neighbor ASes |
| deterministic-med | Avoid order-dependent winners |
| Missing MED | Treated as 0 or worst—platform-specific |
| med confed | Compare MED across confederation member ASNs |

## Where AIGP fits

On AIGP-aware platforms, **AIGP comparison** typically occurs **after** these steps (or after ORIGIN and in the MED/IGP neighborhood—verify OS). It does not replace AS_PATH or ORIGIN. Link: [AIGP](../08_Path_Attributes/11_AIGP.md) and [Vendor-Neutral Model](02_Vendor_Neutral_Selection_Model.md).

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 bgp deterministic-med
 bgp always-compare-med
!
route-map SET-MED out
 set metric 50
```

### Junos

```text
set protocols bgp path-selection always-compare-med
set protocols bgp path-selection as-path-ignore   # dangerous; lab only / special cases
```

Avoid `as-path-ignore` in Internet edge designs unless you fully understand the blast radius.

### FRRouting

```text
router bgp 65000
 bgp deterministic-med
 bgp bestpath as-path multipath-relax
```

## Verification

```text
show ip bgp 192.0.2.0/24
show ip bgp 192.0.2.0/24 bestpath
! Compare Path, Origin, Metric columns among candidates
```

Lab matrix: fix LP equal; vary AS_PATH length; then equalize AS_PATH and vary ORIGIN; then equalize and vary MED with/without always-compare-med.

## Risks

- Enabling always-compare-med across unrelated metric domains.
- Using as-path-ignore to “fix” TE.
- Forgetting AS_SET length quirks after aggregation.
- Debugging MED when AS_PATH already decided the winner.

## Interview framing

“After LOCAL_PREF, BGP compares AS_PATH length, then ORIGIN, then MED within the configured scope; later metrics never compensate for an earlier loss.”

---
