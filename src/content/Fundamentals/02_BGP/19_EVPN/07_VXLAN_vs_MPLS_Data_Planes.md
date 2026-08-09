# EVPN over VXLAN vs MPLS

EVPN is the **control plane**; **VXLAN** and **MPLS** (and others) are possible **data planes**. The same route types apply; encapsulation and underlay differ.

## Comparison

| Property | VXLAN | MPLS |
|---|---|---|
| Service identifier | VNI | MPLS service / EVPN label |
| Underlay | IP routed fabric (often ECMP) | LDP / RSVP / SR transport |
| Endpoint | VTEP IP | PE loopback |
| Common home | Data center / cloud | SP WAN / NVO3 hybrid |
| BUM | Underlay MC or ingress replication | P2MP LSP or IR |

## Signaling agreement

The EVPN route’s encapsulation extended community / label fields must match the enabled data plane. Advertising VXLAN encapsulation to an MPLS-only PE yields control-plane routes without a usable tunnel.

## Failure pattern: “routes good, traffic dead”

Check in order:

1. Underlay reachability to next hop (VTEP IP or PE lo).
2. Tunnel / LSP state (`show nve`, `show mpls lsp`).
3. VNI ↔ BD / VRF mapping.
4. MTU (VXLAN overhead!).
5. Hardware adjacency / symmetric IRB routing.
6. DF / ESI for multihomed access.

## Configuration sketches

### VXLAN EVPN (conceptual)

```text
interface nve1
 source-interface loopback0
 member vni 10000
  ingress-replication protocol bgp
```

### MPLS EVPN

```text
set protocols evpn encapsulation mpls
set protocols bgp family evpn signaling
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **BGP LU / SR** | MPLS underlay to PE NH |
| **IGP ECMP** | VXLAN underlay multipath |
| **AIGP** | Rare in DC; more SP seamless designs—[AIGP](../08_Path_Attributes/11_AIGP.md) |

## Verification

```text
show bgp l2vpn evpn <route> detail
! encapsulation / VNI / MPLS label
show nve peers
show mpls forwarding-table
! MTU: ping size with DF bit
```

## Interview framing

“EVPN rides VXLAN or MPLS; VNI versus service label and IP fabric versus LSP underlay change operations, but missing underlay or encapsulation mismatch is the usual ‘RIB up, traffic down’ cause.”

---
