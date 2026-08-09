# BGP-LS SPF Routing

**RFC 9815** defines an Experimental mechanism where BGP speakers compute **shortest paths** from link-state information carried by BGP-LS—i.e., BGP performs **link-state-style route computation** inside a controlled domain.

## Contrast with ordinary BGP-LS

| Mode | Who computes paths |
|---|---|
| Classic BGP-LS | Controller/PCE consumes topology; BGP does not SPF-install Internet-style |
| BGP-LS SPF (RFC 9815) | Speakers run SPF on BGP-LS topology and install results per domain rules |

## Key concerns

| Concern | Why |
|---|---|
| Complete consistent topology | Partial TED → wrong SPF |
| Metric / algorithm identity | Mismatch = loops or blackholes |
| Distribution scale | Flooding LS via BGP |
| Failure convergence | vs native IGP timers |
| Strict domain boundaries | Must not leak into public Internet eBGP |

## When you would consider it

Controlled fabrics wanting a single protocol family, or research/advanced SP designs—**after** mastering ordinary BGP policy and BGP-LS export. This is **not** how Internet eBGP selects paths.

## Interactions

| Mechanism | Relationship |
|---|---|
| **BGP-LS** | Topology transport—[02](02_BGP_Link_State.md) |
| **IGP** | Often replaced or paralleled inside the domain |
| **SR** | SIDs may appear in LS attributes |

## Verification / stance

Treat as reading-knowledge for interviews unless your lab specifically runs an implementation. Confirm domain isolation policy before any enablement.

## Interview framing

“BGP-LS SPF lets BGP compute IGP-like shortest paths from BGP-LS topology inside a controlled domain; it is experimental and distinct from both Internet BGP and controller-only BGP-LS.”

## Decision process (conceptual)

1. Collect BGP-LS node/link/prefix NLRI for the SPF domain.
2. Build a consistent TED with agreed metrics and algorithm ID.
3. Run SPF rooted at the local speaker (or compute per RFC rules).
4. Install resulting next hops into the designated RIB/FIB tables.
5. Recompute on topology UPDATEs—convergence bound by BGP-LS distribution, not classic IGP flooding timers.

Incomplete topology (filtered links, asymmetric export) produces **wrong** shortest paths that look “valid” in BGP.

## Configuration stance

There is no single universal knob across vendors yet. If an implementation exposes BGP-LS SPF:

- enable only inside a dedicated routing instance / controlled AS;
- block redistribution toward Internet eBGP;
- pin metric and SPF algorithm identity;
- monitor TED sync before cutting over traffic.

Until you operate a supported train, keep this as interview and design reading.

## Lab idea

Compare native IS-IS SPF next hops to BGP-LS SPF next hops on the same topology after a link metric change; document convergence and any ECMP differences.

---
