# Administrative Preference and LOCAL_PREF

Some platforms expose a **local-only** preference such as Cisco **weight** before LOCAL_PREF. Weight is not a standard BGP attribute, is not advertised, and affects only the router where it is configured.

LOCAL_PREF is the standardized AS-wide exit preference. Hierarchy:

| Tool | Scope | Typical use |
|---|---|---|
| Weight (or equivalent) | Single router | Rare device-specific exception |
| LOCAL_PREF | Entire AS (via iBGP) | Consistent outbound policy |
| IGP cost to NEXT_HOP | Per router | Hot-potato among equal LP paths |
| AIGP | Trusted multi-AS domain | Accumulated interior cost ([AIGP](../08_Path_Attributes/11_AIGP.md)) |

If the intent should survive failure of one edge router, encode it in **shared import policy / communities → LOCAL_PREF**, not an undocumented local weight.

## Configuration patterns

### Cisco IOS / IOS XE

```text
! Local-only exception (use sparingly)
route-map WEIGHT-EDGE permit 10
 set weight 40000
!
! AS-wide policy
route-map FROM-CUST permit 10
 set local-preference 300
!
router bgp 65000
 neighbor 192.0.2.1 route-map WEIGHT-EDGE in
 neighbor 198.51.100.1 route-map FROM-CUST in
```

Default weight for locally originated routes is often 32768; learned routes 0—confirm platform defaults.

### Junos

Junos has no Cisco-style weight; use LOCAL_PREF, `preference`, or `local-preference` in policy. Protocol preference (AD-like) is separate from BGP LOCAL_PREF.

```text
set policy-options policy-statement FROM-CUST term 1 then local-preference 300
set policy-options policy-statement FROM-CUST term 1 then accept
```

### FRRouting

```text
route-map FROM-CUST permit 10
 set local-preference 300
! weight available on some builds:
! set weight 40000
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Communities | Map peer TE communities → LOCAL_PREF on import |
| AS_PATH length | Evaluated only after LOCAL_PREF ties |
| RR | Must propagate LOCAL_PREF unchanged for AS-wide consistency |
| Multipath | Unequal weight/LP usually blocks ECMP |

## Verification

```text
show ip bgp 192.0.2.0/24
! Weight and LocPrf columns (Cisco)
show bgp ipv4 unicast 192.0.2.0/24 bestpath
```

Lab: set higher weight on the worse LP path on one router only; confirm that router diverges from the rest of the AS—then remove weight and fix LP instead.

## Risks

- Undocumented per-box weight causing “works on edge-1, fails on edge-2.”
- Mixing protocol administrative distance discussions with LOCAL_PREF (different layers).
- Expecting AIGP or IGP cost to override LP.

## Interview framing

“Weight is local and non-transitive; LOCAL_PREF is the AS-wide outbound knob compared early in best-path; prefer LP for any intent that must be consistent across routers.”

---
