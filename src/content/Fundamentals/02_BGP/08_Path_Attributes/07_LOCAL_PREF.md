# LOCAL_PREF

LOCAL_PREF expresses the preferred **exit from an AS**. Higher is normally better. It is a well-known discretionary attribute (type code 5): present and meaningful inside an AS (and confederation, depending on design), and **not normally sent to external eBGP peers**.

## Where it sits in selection

LOCAL_PREF is evaluated very early—after any local-only weight, and **before** AS_PATH length, ORIGIN, MED, eBGP/iBGP, and IGP cost. See [Administrative Preference and LOCAL_PREF](../10_Best_Path/03_Administrative_Preference_and_LOCAL_PREF.md) and [AIGP](11_AIGP.md) (AIGP does not override LOCAL_PREF).

Because of that placement, a longer customer AS_PATH with high LOCAL_PREF can defeat a shorter provider path **by design**.

## Common commercial import ranking

| Source class | Typical LOCAL_PREF | Intent |
|---|---|---|
| Customer | Highest (e.g. 300) | Prefer to exit toward customers (revenue / valley-free) |
| Peer | Middle (e.g. 200) | Settlement-free paths |
| Provider / transit | Lowest (e.g. 100) | Paid upstream as last resort |

Operators also set LOCAL_PREF from communities, RPKI state, region, or performance classes. Document the numeric scheme as an API.

## Configuration patterns

### Cisco IOS / IOS XE

```text
route-map FROM-PEER permit 10
 set local-preference 200
route-map FROM-CUST permit 10
 match community CUST-TAG
 set local-preference 300

router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 neighbor 192.0.2.1 route-map FROM-PEER in
 neighbor 198.51.100.1 remote-as 65001
 neighbor 198.51.100.1 route-map FROM-CUST in
```

### Junos

```text
set policy-options policy-statement FROM-PEER term 1 then local-preference 200
set policy-options policy-statement FROM-PEER term 1 then accept
set protocols bgp group PEERS import FROM-PEER
```

### FRRouting

```text
route-map FROM-PEER permit 10
 set local-preference 200
!
router bgp 65000
 neighbor 192.0.2.1 route-map FROM-PEER in
```

Default LOCAL_PREF on many platforms is **100** when unset.

## Interactions

| Mechanism | Interaction |
|---|---|
| Weight (Cisco) | Local-only; can override LOCAL_PREF on **one** router |
| Communities | Import maps community → LOCAL_PREF (provider TE API) |
| MED / prepend | Influence **inbound** to you or remote AS_PATH; LOCAL_PREF owns **outbound** exit choice |
| iBGP / RR | LOCAL_PREF must be consistent AS-wide or exits disagree |
| Multipath | Unequal LOCAL_PREF usually prevents ECMP |

## Verification

```text
show ip bgp 192.0.2.0/24
! LocPrf column
show bgp ipv4 unicast 192.0.2.0/24 bestpath
show route 192.0.2.0/24 extensive   # Junos: Localpref
```

Lab checks:

1. Two eBGP paths, equal AS_PATH: higher LOCAL_PREF wins.
2. Lower LOCAL_PREF with shorter AS_PATH: LOCAL_PREF still wins.
3. Confirm attribute is **not** present toward eBGP advertised-routes (unless confederation/special policy).

## Risks

- Setting LOCAL_PREF only on one edge router → inconsistent exits and asymmetric troubleshooting.
- Using LOCAL_PREF to “fix latency” without measuring the actual preferred circuit under failure.
- Accidentally exporting LOCAL_PREF semantics via communities that remote networks mis-handle.

## Interview framing

“LOCAL_PREF is AS-wide outbound exit preference, higher better, compared before AS_PATH; it is not sent to ordinary eBGP peers, and it beats shorter AS paths by design.”

---
