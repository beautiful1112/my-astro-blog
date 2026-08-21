# IS-IS versus OSPF for design

Both are link-state IGPs. CCDE cares about **operational and architectural** differences, not TLV trivia for its own sake. Neither is universally “faster” or “more scalable” without topology, dual-stack needs, and **who can operate it**.

## Side-by-side

| | OSPF | IS-IS |
|---|---|---|
| Layer framing | IP (OSPFv2 / OSPFv3) | CLNS-framed; carries IP in TLVs |
| Hierarchy | Areas + backbone **area 0** | L1 / L2; backbone is **contiguous L2** |
| Dual stack | OSPFv3 AF or ships-in-night v2+v3 | Natural multi-topology / TLV culture |
| Culture | Enterprise campus/DC | SP and large DC/core |
| Extensions | Broad enterprise feature set | SR, TE historically comfortable in SP |
| Multi-vendor | Very common in enterprise | Common in SP; verify enterprise edge cases |

```text
OSPF mental model:        IS-IS mental model:
  non-0 -- ABR -- 0         L1 island -- L1/L2 -- L2 backbone
  must touch area 0         L2 must be contiguous (no "area 0" ID)
```

## When the choice is real

Pick **IS-IS** when the constraint is a large, dual-stack, MPLS/SR core and staff can operate it.

Pick **OSPF** when the constraint is enterprise skill, campus multi-area habits, and multi-vendor access layers that already speak OSPF.

Pick **neither as religion** when BGP already owns the fabric policy and the IGP only needs to be a boring underlay—then choose the boring option your NOC already runs.

## Decision table

| Driver | Lean OSPF | Lean IS-IS |
|---|---|---|
| Campus + enterprise NOC | Yes | Only with training plan |
| SP MPLS/SR core | Possible | Often natural |
| Dual-stack underlay simplicity | OSPFv3 discipline required | Often smoother ops story |
| PE-CE toward enterprise CE | OSPF/EIGRP toward CE | Keep IS-IS in core |
| Migration cost | Stay if already deep | Only with program + exit criteria |

## Real-world — national ISP core refresh

**Context:** IPv4 OSPF legacy core; IPv6 bolted on; SR-MPLS rollout; NOC already trained on IS-IS from a prior acquisition.

| R / C / A | Statement |
|---|---|
| R | Single underlay protocol family for v4/v6 before SR-TE expansion |
| R | No customer-facing change during core cut (PE-CE stays) |
| C | Two-year overlap max; cannot run dual IGP forever |
| A | “OSPF can do SR equally” — true enough technically; ops preference is IS-IS |

```text
CE -- PE --(IS-IS L2 + SR)-- P -- PE -- CE
              ^
         L1 only at limited edge POPs if needed
```

**Choice:** IS-IS in core; BGP for services; OSPF remains only on temporary migration islands with tagged seams. Residual: enterprise-hired engineers need IS-IS runbooks—budget training.

## Real-world — manufacturing enterprise “IS-IS because SP blog”

**Wanted:** Replace stable OSPF campus with IS-IS “for scale” (80 routers, summarizable areas already).

| Factor | Finding |
|---|---|
| Scale pain | Not present—LSDB fine |
| Skill | Two network engineers, OSPF only |
| Benefit | Negligible vs migration risk |
| Verdict | Keep OSPF; invest in BFD and ABR hygiene |

**Lesson:** Protocol fashion is not a requirement. Scale and dual-stack pain are.

## Hierarchy mapping (design language)

| OSPF idea | IS-IS cousin | Design note |
|---|---|---|
| Area 0 backbone | L2 backbone | Contiguity rules differ |
| Non-backbone area | L1 area | L1 learns inter-area via L1/L2 |
| ABR | L1/L2 router | Placement still about summary and blast radius |
| Stub tools | L1 with default via ATT bit | Different knobs, same intent: shrink databases |

Do not assume every OSPF stub trick maps one-to-one—learn the IS-IS attachment/default behavior before copying a template.

## Design checklist

1. What problem does a protocol change solve that hierarchy/BFD/BGP will not?
2. Is dual-stack ops a real pain today?
3. Does the team have 03:00 IS-IS (or OSPF) fluency?
4. Where will PE-CE / campus edge protocols stay during and after a core change?
5. Is there a migration exit date if both run temporarily?

## Risks

- Migrating for fashion in a stable OSPF enterprise.
- Breaking L2 contiguity (IS-IS) or area-0 attachment (OSPF) during redesign.
- Running OSPFv2+v3 ships-in-night without a clear dual-stack story—or assuming IS-IS needs zero thought.
- Dual IGP without a BGP/tag seam during migration.

## Interview framing

“I use IS-IS for large dual-stack MPLS/SR cores and OSPF when the enterprise already lives in areas. I do not migrate for fashion.”

## Related

- [Levels and L1/L2 placement](02_Levels_and_L1L2_Placement.md)
- [IS-IS for SP and MPLS](03_ISIS_for_SP_and_MPLS.md)
- [OSPF to IS-IS migration](04_OSPF_to_ISIS_Migration.md)
- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [OSPF area design](../07_OSPF_Design/01_OSPF_Area_Design.md)

---
