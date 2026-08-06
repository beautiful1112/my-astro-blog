# PIM Source-Specific Multicast

Source-Specific Multicast changes the receiver request from “send me group `G` from any source” to “send me group `G` only from source `S`.” The receiver learns `(S,G)` out of band—from configuration, DNS/service discovery, or an application feed definition—so the network does not need an RP to discover the source.

## Complete flow

1. The application requests an SSM membership for `(S,G)` on a specific interface.
2. The host sends IGMPv3/MLDv2 source-filter state equivalent to `INCLUDE {S}`.
3. The LHR validates that `G` belongs to its configured SSM range and records source-specific local interest.
4. It performs RPF toward `S` and sends a PIM `(S,G)` Join to that upstream neighbor.
5. Each router installs `(S,G)` state and propagates the Join toward `S` until it reaches the source LAN or existing tree.
6. Data from `S` passes RPF and follows the reverse of that Join path to receivers.
7. Removal of the final local/downstream source-specific interest sends a Prune or lets state expire.

The source may already be transmitting or may start later. There is no Register probe: existing `(S,G)` Join state is ready when traffic begins.

## What disappears

SSM has no:

- `(*,G)` shared tree;
- RP mapping or BSR/Auto-RP dependency;
- PIM Register or Register-Stop;
- ASM source discovery;
- MSDP SA exchange; or
- RPT-to-SPT transition—the initial tree is source-rooted.

PIM Hellos, Join/Prune soft state, MRIB/RPF, snooping, membership timers, MFIB programming, TTL, capacity, and application loss handling still apply.

## Address ranges

The standardized IPv4 SSM range is `232.0.0.0/8`. IPv6 SSM addresses use the `ff3x::/32` format with the appropriate scope nibble. Operators can configure an expanded IPv4 SSM range, but every router and receiver-facing policy must agree; otherwise one router may treat a group as ASM while another treats it as SSM.

## IGMPv2/MLDv1 receivers

Older membership protocols cannot signal `S`. Some networks use SSM mapping to translate a group-only join into a statically or dynamically provisioned source, but this reintroduces mapping operations and usually supports only limited source semantics. Native IGMPv3/MLDv2 is clearer and should be preferred.

## Security boundary

SSM prevents traffic from an unwanted **different source address** from matching receiver state, but it does not authenticate `S`. Source-address spoofing, compromised approved sources, and on-path injection remain threats. Enforce source address validation near sources and `(S,G)` allowlists at boundaries.

## Troubleshooting

1. Verify the socket joined the correct source, group, and interface.
2. Decode the IGMPv3/MLDv2 source list; a group-only join is not proof of SSM.
3. Confirm identical SSM range configuration across routers.
4. Follow `(S,G)` Join state hop by hop toward `S`.
5. Verify source MRIB/RPF, not RP reachability.
6. Check that snooping supports the required group/source behavior.
7. Confirm data source address exactly matches `S` and passes policy.

For controlled one-to-many distribution, SSM normally gives the smallest failure surface and most deterministic tree.

