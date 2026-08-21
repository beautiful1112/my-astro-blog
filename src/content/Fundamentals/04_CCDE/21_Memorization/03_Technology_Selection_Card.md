# Technology selection card

Quick “pick / avoid” with a forcing question. Always add skill/vendor constraints.

## IGP

| Pick | When | Avoid when |
|---|---|---|
| OSPF | Multi-vendor campus/DC | Huge flat WAN without hierarchy |
| IS-IS | SP/MPLS/SR culture | No skill / tiny IT shop |
| EIGRP | Cisco hub-spoke + stub | Multi-vendor core |

**Force:** “Who debugs this at 03:00?”

## BGP

Use for Internet, seams, scale, VPN, multitenancy.  
Avoid dumping full tables into IGP.

**Example:** Campus OSPF; BGP only at Internet + DC VRF seams.

## L2 / fabric

| Pick | When |
|---|---|
| L3 access / tiny L2 | Default campus |
| vPC/MLAG | Local dual-attach only |
| EVPN-VXLAN | DC/fabric skill + need |

Avoid: campus-wide VLAN for “simplicity.”

## WAN / cloud

| Pick | When |
|---|---|
| Dual-hub spoke | Branch to central |
| DIA + SSE | SaaS-heavy |
| Private interconnect | Steady IaaS, residency |

Avoid: SD-WAN as substitute for second fiber.

## MPLS / SR

MPLS to hide tenants / unify VPN. SR for underlay FRR/steer when platforms ready.  
VPN policy stays BGP.

## Multicast / QoS

SSM if possible; anycast-RP if ASM. QoS needs trust + seam maps.

## Security tooling

VLAN ≠ zone. VRF/SG + FW PEP. ZTNA for user-to-app; still segment servers.

## Related

- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [Trade-off thinking](../02_Design_Mindset/04_Trade_Off_Thinking.md)

## How to drill this card

1. Cover the right-hand examples; recite the rule.
2. Invent a one-line industry scene that forces the rule.
3. Write the discarded anti-pattern.
4. Link aloud to one Practical case in module 19.

## Expansion examples

| Rule | Scene |
|---|---|
| Bound the domain | Retail POS VLAN per store, not region |
| Dual path before timers | Second fiber before BFD 50 ms |
| BGP at seams | Internet communities, not OSPF defaults from ISP |
| RT = topology | Hub-spoke stores, no store-store |
| SoT + canary | Git push to 5 closets first |

## Anti-cram note

Memorization supports speed; it does not replace R/C/A extraction on a fresh scenario.

## How you prove it

- Explain one bullet with a topology sketch from memory
- Survive a “when not” question without notes
- Map the bullet to a business outcome in one sentence
## Micro-scenario (second pass)

**Brief:** Constraints tighten mid-project (budget cut, skill loss, or regulator letter).

| R / C / A | Statement |
|---|---|
| R | Preserve the original outcome metric |
| C | New hard limit appears |
| A | “Keep the old HLD unchanged” — usually false |

**Move:** Re-open only the decisions that the new constraint touches; keep invariants that still fit. Document what you demote from requirement to wish.

## One-page defense skeleton

```text
Outcome (R#)
Choice (one sentence)
Loser (one sentence)
Spend (cost/complexity/suboptimal)
Residual risk
Proof (test/KPI)
```

---
