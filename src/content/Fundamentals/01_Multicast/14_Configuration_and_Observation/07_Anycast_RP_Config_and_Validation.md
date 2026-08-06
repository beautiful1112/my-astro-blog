# Anycast RP configuration and validation pattern

An Anycast-RP configuration has a shared address plane and a unique synchronization plane. The following pseudoconfiguration emphasizes invariants rather than one vendor's exact syntax.

```text
RP-A unique loopback: 10.255.1.1/32
RP-B unique loopback: 10.255.1.2/32
Shared RP loopback:   10.255.0.1/32 on both
ASM group range:      239.10.0.0/16 -> RP 10.255.0.1
```

Both RPs must originate the exact shared `/32` into the IGP and retain unique-address reachability. Ordinary routers map the group to the shared address; they do not map half the domain to each unique address.

## Synchronization option A: MSDP

Cisco-like intent:

```text
! RP-A
ip msdp peer 10.255.1.2 connect-source Loopback1
ip msdp originator-id Loopback1

! RP-B
ip msdp peer 10.255.1.1 connect-source Loopback1
ip msdp originator-id Loopback1
```

Use SA filters and authentication/supporting controls appropriate to the platform. For more than two members, build a topology that satisfies the MSDP peer-RPF/mesh-group design; do not assume a partial mesh works.

## Synchronization option B: PIM Anycast RP

Conceptual Cisco-like intent on **every** member:

```text
ip pim anycast-rp 10.255.0.1 10.255.1.1
ip pim anycast-rp 10.255.0.1 10.255.1.2
```

The member list must be identical and use unique addresses. Registers received from a source DR at one member are copied to the others.

Do not mix internal PIM Anycast synchronization and MSDP between the same members without a design that accounts for source classification and external MSDP behavior.

## Validation

From source-side and receiver-side routers verify:

- `RP(G)` is the shared address;
- MRIB RPF toward the shared address reaches the expected physical member;
- the FHR sends Registers to the shared address;
- every member learns the source through SA or copied Register;
- the member with receiver interest creates `(S,G)` Join toward `S`;
- member unique addresses and sessions are stable;
- shared prefix withdrawal follows RP service failure, not only node-link failure.

## Failure exercise

1. Run one established SPT flow and one RPT-only flow.
2. Disable RP-A's RP service or withdraw its shared prefix.
3. Measure IGP/MRIB movement and Join/Register behavior.
4. Start a new source near RP-A's former location.
5. Start a new receiver near RP-B.
6. Break only synchronization while both shared routes remain.
7. Restore the service and check duplicate/stale SA, Register, and mroute state.

The design passes only if cross-member new source/new receiver combinations work through each allowed failure.
