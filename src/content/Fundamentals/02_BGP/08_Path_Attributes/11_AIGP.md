# AIGP (Accumulated IGP Metric)

AIGP is an optional non-transitive BGP path attribute defined in **RFC 7311**. It carries an accumulated IGP metric across BGP boundaries so best-path selection can prefer the path with the lowest end-to-end interior cost when administrative policy makes that desirable.

## Why MED and IGP-to-next-hop are not enough

Without AIGP:

- **IGP metric to BGP next hop** only compares distance to the immediate BGP NEXT_HOP inside the local AS.
- **MED** is typically compared only among paths from the **same** neighboring AS and is often ignored or overwritten.
- Across a multi-AS backbone, confederations, or seamless MPLS domains, the true interior cost of distant segments is invisible to classic BGP decision steps.

AIGP lets cooperating domains expose a single comparable metric that accumulates as the route travels.

## Attribute behavior

- Type code **26**, optional, non-transitive.
- Value is a metric TLV (commonly a 32-bit metric accumulated along the path).
- Non-transitive: AIGP is not blindly flooded to arbitrary Internet peers. Only AIGP-enabled speakers that trust the administrative domain should send and accept it.
- When a route is advertised to a peer that should carry AIGP, the speaker adds its local IGP distance (to the previous next hop or per local policy) into the accumulated value.

If AIGP is present on some paths and absent on others, implementations follow RFC 7311 / platform rules (often prefer AIGP-enabled paths when the feature is enabled, or treat missing AIGP as worst/infinite—**verify the platform**).

## Best-path placement

On AIGP-aware platforms, comparison typically occurs **after LOCAL_PREF / local origination / AS_PATH / ORIGIN**, and **before or instead of** ordinary IGP-to-next-hop cost for those paths—exact insertion point is implementation-specific but conceptually:

1. Administrative weight / LOCAL_PREF still win (policy first).
2. Among remaining candidates, **lower AIGP is better**.
3. Ordinary IGP cost to NEXT_HOP remains relevant for paths without usable AIGP or as a later tie-breaker.

AIGP does **not** override LOCAL_PREF. Operators who want metric-driven exit selection across an AIGP domain keep LOCAL_PREF equal.

For the full decision ladder and where AIGP sits relative to eBGP/iBGP and IGP cost, see [Vendor-Neutral Best-Path Model](../10_Best_Path/02_Vendor_Neutral_Selection_Model.md) and [eBGP vs iBGP and IGP Cost](../10_Best_Path/05_eBGP_iBGP_and_IGP_Cost.md).

## Typical deployment domains

| Design | Role of AIGP |
|---|---|
| Seamless MPLS / unified L3VPN backbone | Prefer lowest-cost PE exit across area/AS boundaries |
| Confederations | Carry interior cost across member-AS eBGP |
| Data-center or campus BGP-as-IGP | Optional; often IS-IS/OSPF or BGP Link-State + SR replaces this need |
| Public Internet eBGP | Do **not** enable; untrusted metrics become a traffic-steering attack surface |

## Configuration patterns

### Cisco IOS XR (conceptual)

```text
router bgp 65000
 address-family ipv4 unicast
  aigp
 !
 neighbor-group CORE
  aigp
  address-family ipv4 unicast
   aigp send med
  !
 !
```

Exact knobs (`aigp`, `aigp send`, redistribution of IGP cost into AIGP) differ by OS. Always confirm:

- whether AIGP is enabled per neighbor / AF;
- how redistributed or aggregated routes seed the initial metric;
- whether MED is derived from AIGP for non-AIGP peers.

### Junos

```text
set protocols bgp group CORE aigp
set policy-options policy-statement SET-AIGP term 1 then aigp-originate
```

Originating AIGP on injected routes requires an explicit policy on many platforms; merely enabling the attribute on the session is not enough.

## Interactions

| Feature | Interaction |
|---|---|
| **MED** | Some designs translate AIGP into MED toward non-AIGP neighbors. Document the translation to avoid double-counting. |
| **Multipath** | AIGP-equal paths may become ECMP candidates when multipath is enabled. |
| **Route reflectors** | RRs must preserve AIGP; path hiding can still conceal a lower-AIGP path unless ADD-PATH or optimal reflection is used. |
| **SR / Flex-Algo / CAR** | Modern TE often uses colored intents instead of scalar AIGP; know both models. |
| **Redistribution** | Seed AIGP carefully when redistributing IGP→BGP or static→BGP; wrong seeds create persistent suboptimal exits. |

## Verification

```text
show bgp ipv4 unicast <prefix> detail
! Look for AIGP: <metric>
show route <prefix> extensive
```

Lab checks:

1. Two paths with equal LOCAL_PREF/AS_PATH; lower AIGP wins.
2. Higher LOCAL_PREF still beats lower AIGP.
3. Disable AIGP on one peer: attribute stripped / not accepted; selection falls back to classic rules.
4. Fail a low-AIGP IGP link: accumulated value increases and traffic moves only after BGP re-advertisement—measure control-plane delay separately from IGP convergence.

## Risks

- Enabling AIGP toward untrusted peers allows metric spoofing.
- Mixing AIGP and non-AIGP exit PEs in one RR cluster without ADD-PATH recreates path-hiding issues.
- Operators sometimes expect AIGP to fix latency; it optimizes **configured IGP cost**, not measured delay, jitter, or loss.

## Interview framing

“AIGP is RFC 7311’s optional non-transitive accumulated IGP metric so BGP can compare interior cost across trusted AS boundaries; LOCAL_PREF still dominates, and it is not an Internet feature.”

---
