# PIM Sparse Mode complete flow

PIM-SM assumes receivers are sparse and sends no data onto a branch until explicit interest exists. In Any-Source Multicast (ASM), an RP gives unknown sources and unknown receivers a common meeting point. The phases below are logical phases: sources and receivers can appear in either order, and several phases can run at once for different `(S,G)` flows.

## Example topology

```text
Source S -- source LAN -- FHR ---- transit ---- RP ---- transit ---- LHR -- receiver LAN -- R
                              \____________ possible direct SPT ____________/
```

- `S` sends to ASM group `G`.
- FHR is the PIM DR on the source LAN.
- LHR is the PIM DR on the receiver LAN.
- every router has the same group-to-RP mapping and an MRIB route toward the RP and source.

## Phase 0: prerequisites

Before tree construction can work:

1. PIM neighbors must form on routed transit links.
2. The group must be classified as PIM-SM ASM rather than SSM, BIDIR, or dense mode.
3. every router that handles `G` must select the same reachable RP mapping;
4. the MRIB must provide an RPF interface and, where applicable, a PIM next-hop neighbor toward the RP and `S`;
5. IGMP/MLD and snooping must deliver receiver interest to the LHR.

A failure here can prevent later messages even though individual PIM adjacencies are healthy.

## Phase 1: the receiver constructs the RP tree

1. Receiver `R` joins group `G` through IGMP or MLD.
2. The LHR records local membership and adds the receiver-facing interface to the `(*,G)` outgoing-interface list.
3. The LHR resolves `RP(G)`, performs RPF toward that RP, and sends a PIM `(*,G)` Join to its upstream neighbor.
4. Each upstream router creates or refreshes `(*,G)` state. Its downstream interface joins the OIL; it sends its own Join toward the RP only if it now needs upstream state.
5. Joins from multiple receivers merge when they reach an existing branch. They do not continue as one Join per receiver.
6. The Join stops at the RP or at a router already on the shared tree.

The resulting **RP tree (RPT)** is rooted at the RP. Its control state points upstream toward the RP; data later travels in the reverse direction. Periodic Join refreshes maintain it.

If the receiver leaves, the LHR removes local interest after membership processing. When no inherited or explicit downstream interest remains, PIM can send a `(*,G)` Prune upstream; otherwise the remaining branches continue unaffected.

## Phase 2: the source registers with the RP

A source does not wait for a receiver or signal membership. It simply sends a packet to `G`.

1. The FHR receives the source packet on its correct RPF interface for `S`.
2. If the FHR is the source-LAN DR and `G` maps to an RP, it creates `(S,G)` register state.
3. The FHR places a copy of the complete multicast packet inside a unicast PIM Register addressed to the RP. The original native packet may also be forwarded on any already-existing local/source tree.
4. The RP validates the Register: group mapping, source/RP checks, checksum, policy, and the encapsulated packet's source RPF information.
5. If the RP has downstream `(*,G)` interest, it decapsulates the packet and forwards a native copy down the RPT. If there is no interest, it normally sends Register-Stop and does not create an unnecessary data tree.

The Register tunnel is a control-plane discovery mechanism that temporarily carries data. It is not a permanent GRE/IP tunnel and does not require every transit router to have state for `G`; transit routers unicast the outer packet to the RP.

## Phase 3: the RP obtains native source traffic

Continuously encapsulating a high-rate stream is expensive. After learning `S`, an interested RP normally switches to native delivery:

1. The RP creates `(S,G)` state and sends a PIM `(S,G)` Join toward `S` using the MRIB.
2. The Join travels hop by hop until it reaches the source LAN or an existing `(S,G)` branch.
3. Native packets begin arriving at the RP on the source-facing `(S,G)` RPF interface.
4. The RP can forward them down the existing `(*,G)` shared tree.
5. Once the RP has native forwarding—or if policy says the flow is unwanted—it unicasts a Register-Stop to the FHR.
6. The FHR suppresses data Registers for this `(S,G)` for a randomized interval. Near expiry it sends a **Null-Register**, which contains the encapsulated IP header but no payload, to test whether the RP still wants suppression.
7. A new Register-Stop refreshes suppression. If none arrives, data Registers resume, allowing recovery after RP state loss or a topology change.

Do not interpret Register-Stop as an error by itself. In healthy PIM-SM it is the expected transition from encapsulated to native forwarding. Repeated full-data Registers without transition, however, can indicate that the RP cannot join the source, native packets fail RPF, or Register-Stop cannot return.

## Phase 4: the LHR may switch to the shortest-path tree

When the LHR receives a packet from source `S` on the RPT, it learns the actual source address. Depending on its SPT threshold policy:

1. the LHR creates `(S,G)` state and sends an `(S,G)` Join directly toward `S`;
2. the source-tree Join may follow a different path than the RP tree;
3. during the transition, the LHR can see the same packet on both trees and must avoid duplicate forwarding;
4. after acceptable native `(S,G)` traffic arrives on the source RPF interface, the router sets the `(S,G)` **SPT bit**;
5. it sends an `(S,G,rpt)` Prune toward the RP to remove only source `S` from this receiver branch of the shared tree.

The `RPT` bit in the encoded prune identifies shared-tree prune semantics. `(S,G,rpt)` is not a third data tree: it is per-source negative state inherited under `(*,G)`, preventing the RPT copy of `S` from following a branch that now uses the SPT.

The result is:

```text
Control discovery: receiver -> RP and source -> RP
Initial data:       source -> FHR => Register => RP -> RPT -> receiver
After RP native:    source -> source tree -> RP -> RPT -> receiver
After LHR SPT:      source -> SPT -> receiver; RPT copy pruned for this source
```

An LHR may stay on the RPT (`SPT threshold infinity`), switch immediately, or switch after a traffic threshold. Threshold syntax and defaults are implementation-specific. Immediate SPT behavior is usually appropriate for low-latency streams, while an RPT may reduce source-specific state in a many-source deployment.

## When source and receiver appear in the opposite order

If `S` starts before any receiver, the RP normally returns Register-Stop because it has no `(*,G)` interest. Null-Registers keep source discovery recoverable. When a receiver later builds the RPT, a subsequent probe/full Register lets the RP learn the source and join it. Some implementations retain source state or use other optimizations, so exact first-packet timing varies.

If the receiver exists first, its RPT is ready and the first valid Register can be decapsulated directly onto that tree.

## Steady state and teardown

- Hellos maintain neighbor/DR state.
- periodic Join/Prune messages refresh `(*,G)`, `(S,G)`, and `(S,G,rpt)` state;
- source inactivity expires `(S,G)` state and Register state;
- last-receiver departure removes leaf interest, propagates Prunes where needed, and eventually removes unused tree state;
- an MRIB change can change an upstream neighbor and trigger Prune toward the old path plus Join toward the new one;
- a PIM neighbor restart can be detected by Hello Generation ID and triggers rapid state refresh where supported.

At any point, validate the expected state at **every transition boundary**: local membership, group-to-RP mapping, RPF toward RP, Register path, RPF toward source, RPT OIL, SPT OIL, and MFIB programming.

