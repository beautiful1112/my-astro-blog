# Lab: iBGP and next-hop-self

## Topology

CE/eBGP peer —— Edge —— (iBGP) —— Core/RR client. Edge learns external prefix; client must install it.

## Objectives

- Show unresolved NEXT_HOP when edge does not set next-hop-self and IGP lacks the eBGP peering IP.
- Fix with next-hop-self (or IGP advertisement of the peering /32).
- Contrast with [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) use cases (do not use unchanged here).

## Config touchpoints

```text
! Broken: iBGP without NH change
neighbor 10.0.0.2 remote-as 65000
! Fixed:
neighbor 10.0.0.2 next-hop-self
```

## Tasks

1. Propagate eBGP route over iBGP without next-hop-self; show client BGP entry + failed recursion.
2. Enable next-hop-self; soft-out; verify client NH = edge loopback and CEF complete.
3. Traceroute from client to external prefix.

## Failure injection

Remove IGP route to edge loopback after next-hop-self; path becomes unresolved again.

## Expected evidence

Before: Loc-RIB may show path, FIB incomplete. After: recursive NH via IGP, traceroute succeeds.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
