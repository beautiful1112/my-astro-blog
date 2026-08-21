# Case: mutual redistribution loop

## Context

Two mid-size manufacturers merged. Firm A ran OSPF multi-area campus + WAN; Firm B ran EIGRP named mode across plants. Leadership demanded “everyone can ping everyone in 60 days” without a full renumber. Two border routers (one in each former HQ) were configured to **mutually redistribute** OSPF ↔ EIGRP “so all routes appear everywhere.” Both NOCs retained access; little shared change control.

## Incident

Day 12 after dual redistribute went live: a WAN flap at Plant B caused EIGRP to re-inject prefixes into OSPF with lossy metrics; OSPF re-injected back into EIGRP on the second border. Prefixes oscillated; RIB/FIB churn spiked; CEF inconsistency on borders; WAN circuits saturated with control and repeat data. Plants saw intermittent blackholes to ERP. Incident bridge lasted most of a business day; “fix” was withdraw redistribute on one side—reachability collapsed between firms until a cold BGP seam was rushed.

## R/C/A (reconstructed)

| ID | Type | Text |
|---|---|---|
| R1 | Req | Inter-firm reachability within 60 days for ERP, file, voice signaling |
| R2 | Req | Preserve each plant’s internal IGP during transition |
| R3 | Req | Clear ownership of inter-firm policy (one throat to choke) |
| C1 | Constr | Cannot renumber overlapping RFC1918 in 60 days |
| C2 | Constr | Two NOCs, two change tools, limited shared AAA |
| C3 | Constr | Overlapping 10.0.0.0/8 usage — NAT or discrete leaks required |
| A1 | Assum (bad) | Mutual redistribution at two points is “HA” |
| A2 | Assum (bad) | Distribute-lists can be added later if anything loops |
| A3 | Assum (bad) | Redistribution is a routing detail, not an architecture |

## Options considered

| Option | Description | Verdict |
|---|---|---|
| A | BGP seam (eBGP between merger ASNs or one policy AS); tagged one-way leaks; defaults inside; NAT where overlap | **Strategic — pick** |
| B | Keep dual mutual redistribute; add ad hoc distribute-lists and route-maps per incident | Reject — forever incident |
| C | Single redistribution point only | Temporary bleed reduction; still wrong long-term |
| D | Full renumber to one IGP now | Reject under C1 timeline; good Phase-2 |
| E | Static meglist between HQs | Reject at scale; no policy richness |

## What “good” looks like after

```text
Firm A OSPF domains          Firm B EIGRP domains
        \                           /
         \                         /
      Border-A --- eBGP seam --- Border-B
         ^                         ^
    community/tag              community/tag
    one-way leak policy        one-way leak policy
    (ERP prefixes only)        (ERP prefixes only)

Overlap 10.x: NAT or discrete non-overlap leaks only
No OSPF↔EIGRP mutual redistribute
```

Policy outline:

- Each side originates **tagged** prefixes into BGP once.
- No re-adsorption of BGP→IGP→BGP without `no-export` / tag deny.
- Defaults or summaries inside firms toward seam for unknown remote.
- Overlap: NAT at seam or dual-stack addressing project tracked as Phase-2.

## Metrics / proof

| Test | Pass criteria |
|---|---|---|
| Lab replay of Plant-B flap | No prefix oscillation; BGP stable |
| `show ip route` tags | Redistribute tags present; deny loops on re-inject |
| Withdraw Border-A | Border-B continues policy; no mutual IGP feedback |
| ERP synthetic | RTO path meets R1 without control-plane melt |
| Change control | One shared policy repo for seam route-maps |

## CCDE takeaway

Two IGPs want a **BGP (or equivalent) policy seam**, not a mesh of mutual redistribution. Doing it at two points for “HA” multiplies feedback loops. Tags, one-way leaks, and an owned AS policy beat “everyone sees everything” folklore.

## Related

- [Redistribution as a design smell](../06_Routing_Protocol_Selection/03_Redistribution_as_a_Design_Smell.md)
- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [eBGP edge and policy](../09_EIGRP_and_BGP_Design/05_eBGP_Edge_and_Policy.md)
- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)
- [Implementation and migration plans](../18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)

---
