# Prefix Independent Convergence

**Prefix Independent Convergence (PIC)** precomputes shared backup next-hop structures so many prefixes can switch after one next-hop failure **without** individually reprogramming every BGP route in the FIB.

## Hierarchy idea

```text
Thousands of BGP prefixes
        │
        ▼
  Recursive next-hop object (e.g. PE loopback / NH hierarchy)
        │
   primary → backup forwarding chain
```

On primary failure, the shared object updates once; dependent prefixes inherit the repair. Convergence time becomes closer to **O(next hops)** than **O(prefixes)**.

## PIC edge vs PIC core

| Mode | Protects against | Depends on |
|---|---|---|
| **PIC edge** | External / PE-CE or PE next-hop failure | Alternate BGP next hop in RIB |
| **PIC core** | Core path to BGP NH fails | Fast underlay repair (LFA, TI-LFA, RSVP bypass) |

PIC edge without a second BGP path cannot invent diversity—enable ADD-PATH / multipath first.

## Requirements

- Platform FIB support for hierarchical / multi-path NH objects.
- Eligible backup criteria (IGP diversity, BGP multipath rules).
- Enough memory for primary+backup chains.
- Underlay FRR for PIC core to matter.

## Configuration sketches

### Cisco IOS XR (conceptual)

```text
router bgp 65000
 address-family vpnv4 unicast
  additional-paths install backup
cef adjacency resolve local
```

Exact PIC knobs vary (`bgp bestpath` / `install backup` / CEF hierarchical). Confirm per OS.

### Junos

```text
set routing-options forwarding-table export load-balance-policy
set protocols bgp group RR multipath
! protect-core / FRR features per platform
```

## Verification

```text
show cef <prefix> detail
! primary and backup adjacencies
show bgp ipv4 unicast <prefix>
! multipath / backup path present
! fail NH; measure traffic loss — should be ms-class if PIC armed
```

Verify with **hardware counters and traffic**, not only control-plane failover logs.

## Interactions

| Mechanism | Relationship |
|---|---|
| **ADD-PATH** | Feeds backup paths into RIB for PIC edge |
| **BFD** | Triggers fast NH down |
| **LFA / TI-LFA / SR FRR** | PIC core repair |
| **Path hiding** | RR single-path defeats PIC edge |

## Interview framing

“PIC pre-installs hierarchical primary/backup next hops so many prefixes failover by updating one shared object; you still need real path diversity and usually underlay FRR.”

---
