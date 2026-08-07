# Multicast with VXLAN and EVPN

VXLAN/EVPN uses the word “multicast” for several different functions. Identify which function is under discussion before choosing a control or data-plane model.

## Three distinct functions

| Function | Payload/need | Common mechanism |
|---|---|---|
| underlay replication for BUM | overlay broadcast, unknown-unicast, and multicast Ethernet frames | one underlay group per VNI/bundle or ingress replication |
| tenant bridged IP multicast | hosts in one overlay bridge domain join IP groups | snooping plus EVPN IGMP/MLD proxy/SMET signaling |
| tenant routed IP multicast | source and receiver span IP subnets/VRFs | distributed multicast routing, PIM/MVPN-like signaling, or vendor-specific EVPN multicast |

Underlay multicast for VXLAN BUM does not automatically provide tenant multicast routing. Conversely, an ingress-replication underlay can still support tenant multicast if the overlay control plane represents receiver interest.

## Classic underlay-multicast VXLAN

Each VTEP maps a VNI to an underlay multicast group and joins that group, often using PIM-SSM. A local BUM frame is VXLAN-encapsulated once and the underlay tree replicates it to remote VTEPs.

Benefits:

- one ingress copy regardless of remote VTEP count;
- replication at underlay branch points;
- efficient large fan-out.

Costs:

- PIM/RPF and group state in the underlay;
- group-to-VNI planning and aliasing of many VNIs onto fewer groups;
- delivery to VTEPs with no interested tenant receiver unless overlay pruning exists;
- harder correlation between inner tenant flow and outer underlay `(VTEP,G)`.

## Ingress replication

The ingress VTEP sends one VXLAN copy to each remote VTEP learned through EVPN inclusive-multicast signaling. This avoids underlay PIM but makes bandwidth and packet-generation cost proportional to remote VTEP count.

At 100 remote VTEPs, a 1 Gb/s tenant stream can demand roughly 100 Gb/s of aggregate ingress replication before considering multiple links or encapsulation. Hardware may replicate internally, but uplink bandwidth remains real.

## EVPN IGMP/MLD proxy

RFC 9251 allows an EVPN PE/VTEP to terminate or proxy local membership messages and advertise receiver state through BGP rather than flooding all Reports and Queries across the overlay.

Important EVPN route types are:

| Route type | Name | Purpose |
|---:|---|---|
| 6 | Selective Multicast Ethernet Tag (SMET) | advertises tenant `(*,G)` or `(S,G)` interest for an Ethernet tag/BD |
| 7 | Multicast Membership Report Synch | synchronizes joins across PEs attached to one multihomed Ethernet segment |
| 8 | Multicast Leave Synch | coordinates leave/query timing on that multihomed segment |

The first-hop PE aggregates compatible local host reports into BGP state. Remote PEs use SMET routes to send tenant multicast only toward VTEPs with interest and can trigger selective tunnel setup.

## Multihoming and DF behavior

With an all-active multihomed Ethernet segment, only correct DF/split-horizon and membership synchronization prevent duplicate or missing multicast. A local Report may arrive on one PE while another PE is DF. Type 7/8 synchronization lets the peers preserve membership through DF change and execute a last-listener query interval correctly.

Test:

- DF failure with active receivers;
- leave during DF change;
- one PE missing the SMET route;
- all-active versus single-active behavior;
- duplicate suppression on the Ethernet segment; and
- recovery after BGP session restart.

## Routed tenant multicast

Cross-subnet traffic adds a Layer-3 multicast function at the VTEP/leaf. Questions include:

1. Is the first-hop gateway centralized or anycast/distributed?
2. Where is IGMP/MLD terminated?
3. Is PIM used inside the tenant VRF, translated into BGP routes, or replaced by a vendor-specific model?
4. What represents source-active state and receiver interest?
5. Is replication tied to L2VNI, L3VNI, or a selective tunnel?
6. How is RPF performed for an anycast tenant source gateway?

Support and exact route types vary by platform and release; validate a documented end-to-end profile rather than assuming generic EVPN unicast capability includes routed multicast.

## Observation model

For one failing tenant flow record both headers and both control planes:

```text
Inner: tenant S, tenant G, tenant VLAN/BD/VRF, UDP port
Outer: source VTEP, destination VTEP or underlay G, VNI, underlay RPF path
Control: local IGMP/MLD state, SMET/synch routes, IMET/tunnel state, remote OIF list
Hardware: VTEP replication list, tunnel encapsulation, decap and tenant egress counters
```

This prevents an underlay multicast problem from being mistaken for tenant membership failure—or the reverse.
