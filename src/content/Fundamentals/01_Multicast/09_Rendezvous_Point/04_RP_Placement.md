# RP placement considerations

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

RP placement affects ASM discovery, initial packet latency, shared-tree path stretch, Register load, failure convergence, and operational ownership. It does not affect a steady-state SPT path after the RP has been bypassed.

## Reachability first

Use a stable address, normally a loopback, and ensure the MRIB can reach it from every PIM router that handles the mapped groups. The route should converge with the intended failure domain and must not recurse through a path where PIM is disabled.

Do not place an RP merely because it is topologically central for unicast. Compare:

- source-to-RP Register path;
- RP-to-source native Join path;
- receiver-to-RP `(*,G)` Join path;
- RP-to-receiver RPT data path; and
- likely source-to-receiver SPT.

## Load dimensions

Estimate separately:

- active sources and source churn;
- peak data-Register pps before native transition;
- groups and shared-tree branches;
- steady RPT throughput for receivers that do not switch;
- RP-originated `(S,G)` Join state;
- MSDP SA or PIM Anycast replication load;
- mapping/BSR processing; and
- punt/CPU versus hardware forwarding capacity.

An RP with little steady-state throughput can still be overloaded by a source-registration storm.

## Failure-domain design

Avoid placing all logical redundancy in one rack, line card, power domain, IGP fate-sharing path, control-plane policing policy, or management blast radius. With Anycast, separate the members while preserving low-latency synchronization paths.

Couple service health to reachability when possible. A loopback route that remains advertised after the PIM/RP process fails attracts traffic to a non-working member.

## Policy and scope

- assign explicit group ranges to each RP service;
- exclude the SSM range;
- enforce multicast boundaries at administrative edges;
- allow only approved source prefixes to register;
- filter accepted BSR/candidate-RP or Auto-RP information;
- protect but do not starve Register, BSR, PIM, and MSDP control traffic.

## Design decision

For controlled one-source market feeds, SSM is usually simpler and more deterministic: the receiver already knows `S`, the tree is source-rooted immediately, and RP/Register/MSDP failure modes disappear. Use ASM when source discovery or legacy receiver behavior genuinely requires it, then design the RP as a service with explicit reachability, state synchronization, scale, monitoring, and failure tests.

