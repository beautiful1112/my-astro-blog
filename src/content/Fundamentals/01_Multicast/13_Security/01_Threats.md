# Multicast security threats

Multicast optimizes delivery; it does not provide confidentiality or authenticity. Anyone who can inject or subscribe on a reachable segment may affect many receivers at once.

## Threat catalog

| Threat | Effect |
|---|---|
| Unauthorized receiver joins | Data leakage to untrusted ports/VLANs |
| Unauthorized ASM source injection | Pollution of shared trees; false books |
| Spoofed source addresses | Undermines SSM INCLUDE trust |
| Forged IGMP/MLD / querier takeover | Wrong snooping state; blackhole or flood |
| Forged PIM Hello / Join / Prune / Register | Tree theft, prune of valid OIL, RP load |
| RP / BSR / MSDP poisoning | Wrong mapping; interdomain source lies |
| Amplification via replication | Small inject → large fabric fan-out |
| TCAM / MFIB / control-CPU exhaustion | Collateral loss of legitimate feeds |
| VLAN / VRF / overlay mis-bind | Cross-tenant leakage |

Related: [Controls](02_Controls.md), [Boundary principle](03_Boundary_Principle.md).

## Why multicast widens blast radius

```text
Unicast spoof → one victim path
Multicast inject → every interested OIL + every state machine on path
```

A single forged Join can pull high-rate traffic toward an attacker-controlled leaf; a single unauthorized source can feed thousands of receivers if ASM is open.

## Interactions

| Mechanism | Relationship |
|---|---|
| **SSM** | Shrinks source set but still needs anti-spoof + ACL |
| **ASM + open RP** | Highest injection risk |
| **EVPN/MVPN** | Control-plane route injection becomes a threat surface |
| **Host joins** | Compromised server is an insider receiver |

## Configuration patterns (defensive baseline)

Prefer deny-by-default boundaries; examples live in [Controls](02_Controls.md) and [Boundary ACL config](../14_Configuration_and_Observation/16_Multicast_Boundary_and_ACL_Config.md).

```text
# Conceptual deny of unexpected groups at WAN edge
deny ip any 224.0.0.0 15.255.255.255
permit only documented 232.10.10.0/24 market-data
```

## Verification

1. From an untrusted port: attempt join to production `G`—should fail snooping/ACL.
2. From non-source VLAN: send to `239.10.10.10`—FHR/boundary drop.
3. Monitor: new `(S,G)`, querier changes, RP mapping changes, MSDP SA anomalies.

```text
show ip mroute
show ip igmp groups
show ip pim rp mapping
```

## Risks

- Relying on “obscure” group addresses.
- Encrypting nothing while assuming colo trust equals authenticity.
- Disabling snooping “to make it work,” turning the VLAN into a broadcast domain for multicast.

## Interview framing

“Multicast threats are unauthorized join, unauthorized or spoofed send, control-plane forgery, and amplification through replication—delivery efficiency without authenticity.”

---
