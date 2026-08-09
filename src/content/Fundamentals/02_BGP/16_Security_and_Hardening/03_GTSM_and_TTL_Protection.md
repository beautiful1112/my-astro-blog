# GTSM and TTL Protection

The **Generalized TTL Security Mechanism** (RFC 5082), often called TTL security or GTSM, protects BGP peers by sending packets with **TTL 255** and accepting only packets whose **received TTL** is within the expected hop distance (commonly 255 for directly connected eBGP).

An off-path attacker many hops away cannot normally forge a packet that still arrives with TTL ≥ threshold.

## Mechanism

```text
Sender sets IP TTL = 255
Receiver requires TTL ≥ 255 - (hops-1)
  e.g. directly connected → accept only TTL 255
  e.g. multihop 2 hops → accept TTL ≥ 254
```

## Configuration patterns

### Cisco

```text
router bgp 65000
 neighbor 192.0.2.2 ttl-security hops 1
```

### Junos

```text
set protocols bgp group EBGP neighbor 192.0.2.2 ttl 1
! or "set ... authenticat..." — use ttl security / multihop ttl carefully
set protocols bgp group EBGP neighbor 192.0.2.2 ttl-security
```

Junos and Cisco knobs differ; for multihop loopback peering set the hop count to the real IP hop distance.

### FRR

```text
router bgp 65000
 neighbor 192.0.2.2 ttl-security hops 1
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **MD5 / TCP-AO** | Complementary—auth ≠ hop check |
| **eBGP multihop** | Must raise hop allowance correctly |
| **iACL** | Still restrict source IPs |
| **Asymmetry** | Path length A→B vs B→A can differ—measure both |

## Failure symptom

TTL-security mismatch → session **never Established** even when ASN, addresses, and port 179 look correct. Debug with packet capture of TTL values, not only BGP debugs.

## Verification

```text
show bgp neighbors 192.0.2.2 | include TTL
tcpdump -ni eth0 'tcp port 179' 
! inspect IP TTL field
```

## Design rules

- Default to GTSM on single-hop Internet and customer eBGP.
- Document hop count for every multihop session.
- GTSM does not replace authentication or prefix filters.

## Interview framing

“GTSM requires BGP packets to arrive with an expected high TTL so off-path attackers cannot easily reach the session; it complements MD5/TCP-AO and ACLs, and mismatches look like transport failures.”

---
