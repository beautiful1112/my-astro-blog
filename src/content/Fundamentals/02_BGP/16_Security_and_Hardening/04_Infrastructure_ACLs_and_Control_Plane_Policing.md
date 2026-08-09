# Infrastructure ACLs and Control-Plane Policing

Protect TCP port **179** so only configured peer addresses can reach the BGP process. Combine interface **infrastructure ACLs (iACLs)**, **control-plane policing (CoPP)** / Control Plane Protection, GTSM, session authentication, and management-plane isolation.

## Defense in depth

```text
Edge interface iACL  →  only peer / exception sources to :179
CoPP / CPPr          →  rate-limit BGP / BFD / ARP classes
GTSM + MD5/TCP-AO    →  session authenticity / hop check
Mgmt VRF             →  separate SSH/NETCONF from transit
```

## iACL sketch

```text
! permit configured peers
permit tcp host 192.0.2.2 host 198.51.100.1 eq 179
permit tcp host 192.0.2.2 eq 179 host 198.51.100.1
! deny other BGP to infrastructure
deny tcp any any eq 179
permit ip any any   ! or more selective transit permit
```

Apply as appropriate on external-facing interfaces; never lock yourself out of management.

## CoPP considerations

Legitimate bursts include:

- session establishment;
- route refresh / soft clear;
- reconvergence after mass withdraw.

An overly tight policer drops Keepalives or UPDATEs **during incidents**, causing secondary session loss. Measure normal and failure traffic; set class thresholds with headroom.

### Cisco CoPP (conceptual)

```text
class-map match-any BGP
 match access-group name ACL-BGP
policy-map COPP
 class BGP
  police 10000000 conform transmit exceed drop
control-plane
 service-policy input COPP
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **BFD** | Permit UDP 3784/4784 in iACL/CoPP |
| **BMP** | Collector sessions need ACL exceptions |
| **Max-prefix** | Different layer—content scale vs packet rate |
| **GTSM** | Complements ACL; does not rate-limit |

## Verification

```text
show ip interface <if> | include access
show policy-map control-plane
show control-plane
! generate refresh; confirm no CoPP drops on BGP class
```

## Interview framing

“iACLs and CoPP restrict who can speak BGP to the RP and how hard; size policers for reconvergence bursts or you will drop Keepalives during the event you care about most.”

---
