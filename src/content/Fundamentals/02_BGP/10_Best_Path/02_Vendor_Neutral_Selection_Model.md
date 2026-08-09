# Vendor-Neutral Best-Path Model

RFC 4271 specifies a decision process, but production platforms add local attributes (weight), deterministic-MED, AIGP, and multipath knobs. Use this conceptual ladder, then **verify the platform document** for exact order.

## Conceptual sequence

1. **Prefer administratively favored routes** — e.g. Cisco weight (local-only).
2. **Prefer higher LOCAL_PREF**.
3. **Prefer locally originated** paths where the implementation does so.
4. **Prefer shorter AS_PATH** (with AS_SET / confederation rules).
5. **Prefer lower ORIGIN** — IGP, then EGP, then INCOMPLETE.
6. **Prefer lower MED** under configured comparison scope (same neighbor AS vs always-compare).
7. **AIGP** (when enabled) — prefer **lower** accumulated IGP metric among AIGP-aware paths. Exact insertion is implementation-specific; commonly after ORIGIN/MED-related steps and before or replacing ordinary IGP-to-next-hop comparison for those paths. Details: [AIGP](../08_Path_Attributes/11_AIGP.md).
8. **Prefer eBGP over iBGP** (common vendor step).
9. **Prefer lower IGP metric to BGP NEXT_HOP** (hot-potato) when AIGP is not deciding.
10. **Final tie-breakers** — oldest path, lowest router-ID, shortest CLUSTER_LIST, lowest peer address, etc.

Earlier steps are lexicographic: once a path wins, later criteria do not compensate.

## AIGP in the ladder

| Condition | Behavior |
|---|---|
| AIGP enabled, both paths carry usable AIGP | Lower AIGP preferred (per platform) |
| Only one path has AIGP | Platform-specific (prefer AIGP path vs treat missing as worst)—**lab it** |
| LOCAL_PREF differs | LOCAL_PREF still wins; AIGP never overrides it |
| Public Internet eBGP | Keep AIGP off; untrusted metrics |

Cross-check with [eBGP vs iBGP and IGP Cost](05_eBGP_iBGP_and_IGP_Cost.md) so operators do not confuse AIGP with classic IGP-to-next-hop cost.

## Multipath note

Multipath relaxes selected comparisons for **forwarding** while many systems still mark a single control-plane best path for advertisement. See [Multipath and ECMP](07_Multipath_and_ECMP.md).

## Configuration: inspect decision

### Cisco IOS / IOS XE

```text
show ip bgp 192.0.2.0/24
show ip bgp 192.0.2.0/24 bestpath
bgp bestpath aigp
bgp deterministic-med
bgp always-compare-med
```

### Junos

```text
show route 192.0.2.0/24 extensive
set protocols bgp path-selection always-compare-med
set protocols bgp path-selection aigp
```

### FRRouting

```text
show bgp ipv4 unicast 192.0.2.0/24
router bgp 65000
 bgp deterministic-med
 bgp bestpath aigp
```

## Interactions

| Knob | Effect on model |
|---|---|
| deterministic-MED | Stable MED outcomes with multi-AS candidates |
| always-compare-med | Broadens step 6 across neighbor ASes |
| ignore MED / med confed | Platform-specific MED scope changes |
| ADD-PATH / RR | Changes which candidates exist, not the ladder itself |

## Verification lab

1. Equal everything except LOCAL_PREF → higher wins.  
2. Equal LP, shorter AS_PATH wins.  
3. Equal through ORIGIN; enable AIGP with unequal metrics → lower AIGP wins.  
4. Raise LP on higher-AIGP path → LP wins.  
5. Disable AIGP → falls back to IGP-to-next-hop / eBGP preference.

## Risks

- Memorizing one vendor’s poster as universal law.
- Enabling AIGP or always-compare-med in mixed trust domains.
- Policy underspecification that lands on router-ID tie-breaks in production.

## Interview framing

“State the common ladder, call out weight/LOCAL_PREF first, mention AIGP as an optional RFC 7311 metric before ordinary IGP cost when enabled, and say you verify the platform’s documented order.”

---
