# Multicast Source Discovery Protocol

MSDP distributes knowledge of active IPv4 ASM sources between PIM-SM domains or physical members of an Anycast-RP service. It does not build multicast trees; it tells an RP that source `S` is active for group `G`, after which ordinary PIM can join the source.

## Session and messages

MSDP peers form a TCP session on port **639**, normally between stable loopback/unique addresses. The TCP state machine includes inactive/listen/connecting/established behavior and keepalive/hold timers. An established session proves transport reachability, not that Source-Active messages pass policy or peer-RPF checks.

The central message is Source-Active (SA), which can advertise multiple `(S,G)` entries and identifies the originating RP. Other message forms include SA-Request and SA-Response for non-caching behavior, KeepAlive, and Notification.

## Originating an SA

When an RP learns a locally registered active source, it periodically originates an SA containing `(S,G)` and RP originator information. The initial SA may encapsulate a small amount of the original multicast packet so a remote interested RP can deliver the first data while joining natively; continuing user data does not travel through MSDP.

The originating RP should advertise only authorized source/group state. SA filters at the source domain edge prevent accidental or malicious global discovery.

## Receiving an SA

A receiving MSDP speaker:

1. validates the TCP peer and message;
2. applies inbound SA policy;
3. performs peer-RPF/RPF-peer checks to prevent SA loops;
4. caches or processes the `(S,G,originating-RP)` state;
5. if its PIM domain has local interest in `G`, sends an `(S,G)` Join toward `S` using the MRIB; and
6. forwards the SA to eligible peers according to MSDP rules and policy.

Source discovery and data RPF are separate. An SA can be accepted while the local domain lacks a usable multicast route to `S`.

## Peer-RPF

MSDP SAs can traverse multiple peers, so the receiver accepts an SA only from the peer considered on the correct path toward the originating RP. The decision can use BGP/MBGP/IGP reachability and specific MSDP rules. In a mesh group, members can relax full-mesh forwarding behavior while relying on the group's loop-prevention rules.

A frequent failure is “session established, no SA accepted” because unicast/BGP topology selects another peer as the RPF peer.

## SA cache

Caching implementations retain learned active sources until expiry/withdrawal behavior. The cache improves immediate response to a later local `(*,G)` Join, but consumes memory and exposes stale-state/policy concerns. Non-caching behavior can use SA-Request/Response toward a designated MSDP peer, though support and operational use vary.

## Anycast RP use

With Anycast RP using MSDP:

- all physical RPs share the logical RP address for PIM;
- they establish MSDP sessions using distinct unique addresses;
- an SA learned from the member near the source informs the member near the receiver;
- that receiver-side member joins `(S,G)` natively.

MSDP synchronizes active-source knowledge, not receiver `(*,G)` state and not MFIB contents.

## Default peers and mesh groups

A default MSDP peer can supply SAs when no normal peer-RPF route to the originating RP exists. It simplifies stub designs but requires strict trust and filtering. Mesh groups reduce SA reflooding among a set of peers and alter peer-RPF processing; inconsistent membership can cause missing or duplicate propagation.

## Security and filtering

Apply controls to:

- TCP peer addresses and authentication where supported;
- source and group ranges accepted/advertised;
- SA originators and maximum prefixes/state;
- external versus internal source policy;
- control-plane rate and connection churn; and
- logging/telemetry for new SA entries and rejects.

Never accept arbitrary SAs merely because the peer session is trusted. An unwanted SA can trigger `(S,G)` joins and pull high-rate traffic into the domain.

## Troubleshooting sequence

1. Confirm TCP/639 session endpoints, VRF, uptime, resets, and hold timers.
2. Confirm the source registered at the originating RP.
3. Confirm SA origination and outbound policy.
4. Confirm SA arrival, peer-RPF acceptance, and inbound policy.
5. Confirm local `(*,G)` interest at the receiving RP.
6. Confirm `(S,G)` Join and RPF toward `S`.
7. Confirm native data reaches the receiving RP/domain and flows down the RPT/SPT.

SSM needs none of this because receiver signaling already contains `S`.

