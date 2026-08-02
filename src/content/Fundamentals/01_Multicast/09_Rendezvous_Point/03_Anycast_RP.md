# Anycast RP

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Multiple RP routers advertise one shared RP address into the IGP, so FHRs and LHRs reach a nearby RP. Each RP also needs a unique address for synchronization.

## With MSDP

RPs peer using unique addresses and exchange Source-Active state. This is mature but adds TCP/MSDP policy and SA-cache operations.

## Using PIM (RFC 4610)

Each RP knows the unique addresses of the other members and copies received Registers to them, avoiding internal MSDP synchronization.

Failure analysis must test both anycast reachability and source-state synchronization. A route can fail over while the new RP lacks the state needed for new joins.

