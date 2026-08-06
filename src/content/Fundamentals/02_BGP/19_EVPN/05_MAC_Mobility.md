# EVPN MAC Mobility

When a MAC moves between PEs, a new type 2 route advertises the new location with a higher MAC Mobility sequence number. Remote PEs use the sequence to prefer the newer advertisement.

Rapid alternating moves may indicate:

- A real virtual-machine or host move.
- Layer-2 loop.
- Duplicate MAC.
- Dual-active multihoming error.
- Misconfigured ESI.

Duplicate-MAC detection can freeze or suppress learning after a threshold. During troubleshooting, compare sequence numbers, next hops, ESI, timestamps, and local learning source.

---

