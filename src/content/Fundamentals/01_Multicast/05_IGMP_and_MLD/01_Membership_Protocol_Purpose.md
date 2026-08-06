# What membership protocols do

IGMP for IPv4 and MLD for IPv6 tell multicast routers what receiver interest exists on a **directly attached link**.

They answer:

- Does this link have any listener for group **G**?
- With IGMPv3/MLDv2, which sources should be included or excluded for **G**?
- Has that interest changed or expired?

They do **not**:

- Discover receivers beyond the local link.
- Build a PIM distribution tree.
- Advertise multicast sources between routing domains.
- Carry application payload.
- Identify every receiving process to the router.

## State pipeline

1. An application requests membership on a socket.
2. The host kernel merges socket requests into one interface-level state.
3. The host reports that state through IGMP or MLD.
4. The querier aggregates listener state for the whole link.
5. The router exposes the interest to PIM or another multicast-routing component.
6. A snooping switch may inspect the same messages to constrain Layer-2 forwarding.

~~~mermaid
flowchart LR
    A["Application socket"] --> B["Host interface state"]
    B -->|"IGMP or MLD report"| C["Local querier"]
    C --> D["Outgoing-interface interest"]
    D --> E["PIM or multicast RIB"]
    C -. "Observed by snooping switch" .-> F["Layer-2 port state"]
~~~

Membership is scoped by **interface + group**, and in source-filtering versions by a mode and source list. Joining the correct group on the wrong interface produces a valid report on the wrong VLAN.

## Mental model

IGMP/MLD is a soft-state local-link contract:

> “At least one listener on this link currently wants traffic matching this group/source filter.”

Periodic queries and reports refresh that contract. State disappears after explicit change processing or timer expiry.

