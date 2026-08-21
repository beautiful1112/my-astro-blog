# When the enterprise needs BGP

Bring BGP inside the enterprise when you need **policy, scale, or isolation** that an IGP should not provide. BGP is not “more professional”—it is a different tool: path-vector, attribute-driven, and intentionally slow to converge unless you design around that.

```text
Internet / partners / other ASes
            |
      eBGP edge (filters, max-prefix, TE)
            |
   Enterprise BGP domains (iBGP / eBGP fabric)
            |
   IGP underlay (next-hop reachability for iBGP)
Campus / WAN / DC still need a story for who owns prefixes
```

IGP usually still provides **underlay next-hop** for iBGP. Do not delete the IGP unless you have a full BGP-only design you can operate (common in large DC leaf-spine; rare in classic campus).

## Good reasons

| Driver | Why IGP fails | BGP role |
|---|---|---|
| Internet or WAN PE-CE | Prefix count + policy | Edge and CE routing |
| DC leaf-spine | Need ECMP + scale + ASN policy | Often eBGP underlay/overlay |
| Multi-tenant VRF / MPLS / EVPN | Overlap + RT policy | MP-BGP control plane |
| M&A seam | Two IGPs, conflicting metrics | BGP as the deliberate boundary |
| Inter-region TE | Metric hacks are opaque | Local-pref, MED, communities |
| Prefix count beyond IGP comfort | SPF/LSDB/query blowup | Summaries + policy at seams |

## Bad reasons

| Bad reason | What to do instead |
|---|---|
| “BGP is more professional” | Keep OSPF/EIGRP/IS-IS for the campus |
| Replace 15 campus routers’ IGP with iBGP full mesh | Hierarchy + summarization in the IGP |
| Dump Internet table into OSPF/EIGRP | Default or aggregates at the edge only |
| “One protocol for everything” | Separate underlay IGP from policy BGP |

## Decision table — introduce BGP or not?

| Signal | Prefer IGP only | Prefer enterprise BGP |
|---|---|---|
| Prefixes | Stable tens–low hundreds | Thousands, or Internet-facing |
| Policy | “Shortest / cheapest path” | Prefer this exit, this tenant, this peer |
| Domains | One admin, one address plan | M&A, multi-tenant, SP-like WAN |
| Ops skill | Strong IGP, weak BGP | BGP already at edge / DC |
| Failure story | Link/SPF | Session, RR, policy mistake |

## Real-world — global manufacturer (introduce BGP at seams)

**Facts:** Three regions (EMEA/APAC/AMER), OSPF per region, dual DCs, MPLS WAN from SP, acquiring a company that runs EIGRP. Need controlled interconnect and Internet exits per region.

**Design:**

- Keep OSPF (or EIGRP) **inside** each region
- iBGP (or eBGP between regional ASes) at regional borders for inter-region prefixes
- Internet: eBGP at each regional edge; do not redistribute full tables into IGP
- Acquisition: BGP seam + filtered redistribution; no mutual redistribution without tags

**Discarded:** One flat OSPF domain across continents—WAN flaps and SPF radius are unacceptable. Full iBGP mesh replacing all IGPs—ops cannot support it.

## Real-world — 80-site retail (BGP not needed in campus)

**Facts:** Hub-spoke SD-WAN, default toward hubs, few thousand `/24`s summarizable, no Internet at branches.

**Design:** EIGRP or OSPF (or SD-WAN overlay routing) with stubs/summaries. BGP only at the **Internet / cloud** edge of the hubs.

**Why:** Policy is “default out”; prefix count fits IGP; adding iBGP would add RR ops without buying TE.

## Design checklist

1. What requirement forces policy attributes (not just metrics)?
2. Where is the AS / VRF / RT boundary drawn?
3. Does iBGP still have a reachable IGP next-hop under failure?
4. Who owns Internet prefixes—edge only, never IGP?
5. Can the team troubleshoot BGP communities and RR reflection?

## Risks

- Using BGP as a vanity IGP replacement; worse convergence and harder ops.
- Redistributing Internet BGP into the campus IGP.
- iBGP without RR plan → accidental full mesh debt.
- M&A “temporary” mutual redistribution that becomes permanent loop fuel.

## Interview framing

“Enterprise BGP is for policy and domain seams. The campus IGP stays an IGP until prefix or policy pressure says otherwise—and the Internet never lives in the IGP.”

## Related

- [EIGRP as enterprise IGP](01_EIGRP_as_Enterprise_IGP.md)
- [iBGP scale: RR and confederations](04_iBGP_Scale_RR_and_Confederations.md)
- [eBGP edge and policy](05_eBGP_Edge_and_Policy.md)
- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [BGP deep dive](../../02_BGP/BGP_Deep_Dive.md)

---
