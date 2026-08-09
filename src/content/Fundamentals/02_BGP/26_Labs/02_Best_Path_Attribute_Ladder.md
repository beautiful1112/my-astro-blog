# Lab: Best-Path Attribute Ladder

## Topology

R_dst originates one prefix. R_test receives two paths via R_a and R_b (same or different AS as needed per step).

## Objectives

Prove ordered influence: Weight (if Cisco) → LOCAL_PREF → AS_PATH → ORIGIN → MED (same AS) → eBGP vs iBGP → IGP cost → RID.

## Config touchpoints

```text
route-map VIA-A permit 10
 set local-preference 200
route-map VIA-B permit 10
 set local-preference 100
! Later: equalize LP and prepend on one path; then MED within one neighbor AS
```

Optional: enable AIGP in a trusted lab AS and show it deciding when LP/AS_PATH tie—see [AIGP](../08_Path_Attributes/11_AIGP.md).

## Tasks

1. With only AS_PATH different, confirm shorter wins.
2. Raise LP on the longer path; confirm LP wins.
3. Equalize LP; use MED on two sessions to same ASN; confirm lower MED.
4. Document the `show` output best reason each time.

## Failure injection

Announce a more-specific on the “losing” path; forwarding follows longest match despite attributes.

## Expected evidence

Each step’s winner matches the decision ladder; notes cite attribute values, not guesses.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
