# Business to technical mapping

The network is a **cost and risk instrument** for a business outcome. CCDE starts at the outcome and walks down; it does not start at a protocol and walk up hoping the business fits.

## Mapping table

| Business language | Technical translation |
|---|---|
| Enter a new region in 90 days | Overlay-friendly WAN, address plan, identity, not a new core IGP |
| Reduce branch opex | SD-WAN + zero-touch + fewer truck rolls |
| Survive DC loss | Dual DC, independent control, tested RTO—not “two chassis in one room” |
| Pass PCI / HIPAA / GDPR | Segmentation, logging, residency, who can decrypt |
| Merge two companies | Overlapping addresses, dual IGPs, policy at the seam |
| Launch AI training | East-west bandwidth, lossless fabric, data gravity, not “bigger Internet pipe” |

## Method

1. Restate the business sentence as a testable requirement.
2. List technical options that could satisfy it.
3. Kill options that violate constraints (time, skill, regulation, existing plant).
4. Keep the option whose **operational model** the company can actually run.

```text
"We need digital transformation"
   is not a requirement

"Customers must check out if DC-A is down,
 card data never leaves region EU"
   is a requirement
```

## Mergers, acquisitions, divestitures

These are first-class CCDE problems: overlapping RFC1918, conflicting security policy, different IGPs, and a date. Design the **seam** (BGP, firewall, identity) before you dream of a single IGP.

## Interview framing

“I translate business sentences into testable network requirements, then I pick technology that operations can run on the given calendar—not a reference architecture with the logo swapped.”

---
