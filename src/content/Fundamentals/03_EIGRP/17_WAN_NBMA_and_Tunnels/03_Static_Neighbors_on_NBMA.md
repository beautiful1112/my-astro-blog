# Static neighbors on NBMA

On classic Frame Relay multipoint or any NBMA where multicast hellos fail, configure **static EIGRP neighbors** so control plane uses unicast.

## Hub example (Frame Relay multipoint)

```text
interface Serial0/0
 ip address 10.255.0.1 255.255.255.0
 encapsulation frame-relay
!
router eigrp 100
 network 10.255.0.0 0.0.0.255
 neighbor 10.255.0.2 Serial0/0
 neighbor 10.255.0.3 Serial0/0
```

Spokes list the hub (and each other only if intentional full mesh).

## Spoke

```text
router eigrp 100
 neighbor 10.255.0.1 Serial0/0
 eigrp stub connected summary
```

Stub remains mandatory for scale even with static neighbors.

## Checklist with NBMA maps

1. Layer 2 reachability: PVC / NHRP mapping to neighbor IP works (`ping`).
2. Static `neighbor` statements both directions (or hub lists all spokes).
3. Split horizon policy decided ([NBMA and Multipoint](02_NBMA_and_Multipoint.md)).
4. Bandwidth on Serial/Tunnel set to committed information rate reality.
5. Authentication key chains aligned.

## Named mode

```text
router eigrp WAN
 address-family ipv4 unicast autonomous-system 100
  neighbor 10.255.0.2 Tunnel0
  af-interface Tunnel0
   authentication mode hmac-sha-256
   authentication key-chain WAN-KEYS
  exit-af-interface
```

## Verification

```text
show ip eigrp neighbors
! Address + Interface match static list
show ip eigrp interfaces detail
ping 10.255.0.2
```

If ping works but no neighbor: AS, K-values, auth, passive, ACL on proto 88.

## Risks

- Adding spoke IP to hub routing but forgetting `neighbor`.
- Static neighbors to spokes that are dynamic DHCP/NHRP addresses changing.
- Mixing multicast assumptions with static-only interfaces.

## Interview framing

“NBMA static neighbors replace multicast discovery with unicast; they do not by themselves fix split-horizon spoke-to-spoke route advertisement.”

## Related

- [Static Neighbors Hardening](../16_Authentication_and_Security/04_Static_Neighbors_Hardening.md)
- [Hub-Spoke WAN Checklist](06_Hub_Spoke_WAN_Checklist.md)
- [Neighbors Not Forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md)

---
