# Route-Target Constraint

**Route-Target Constraint (RTC)** (RFC 4684) lets a PE advertise which **RTs it is interested in** so an RR (or peer) can **omit VPNv4/VPNv6 routes** whose RTs the PE will never import. It is a scaling feature for sparse VPN membership.

## Problem

Without RTC, an RR may reflect **all** VPN routes to every PE client. A PE that only imports RT `65000:100` still receives and discards hundreds of thousands of unrelated VPN NLRIs—wasting memory, CPU, and bandwidth.

## Mechanism

1. PE builds an RT membership set from VRF import RTs (and policy).
2. PE advertises those RTs using a dedicated RTC address family (AFI 1 / SAFI 132).
3. RR filters outbound VPNv4/VPNv6 toward that PE based on RT intersection.
4. Default RT membership / special routes may be needed so PE still receives necessary default behaviors—platform dependent.

## Configuration sketches

### Cisco IOS XR (conceptual)

```text
router bgp 65000
 address-family ipv4 rt-filter
  neighbor 192.0.2.1 activate
 address-family vpnv4 unicast
  neighbor 192.0.2.1 activate
```

### Junos

```text
set protocols bgp group RR family route-target
set protocols bgp group RR family inet-vpn unicast
```

Both PE and RR must support and activate RTC.

## Interactions

| Mechanism | Relationship |
|---|---|
| **RT import changes** | Must update RTC advertisements or PE misses new extranets |
| **ADD-PATH** | Orthogonal—multiplies paths for RTs you *do* import |
| **Inter-AS Option B** | RTC semantics across ASBRs need careful design |
| **EVPN** | Separate families may have their own filtering features |

## Operational risks

- Enabling RTC incorrectly → PE missing VPN routes (under-import).
- Leaving RTC off in huge VPN hosts → PE memory pressure.
- Hub PE that imports many RTs gains less from RTC than sparse spokes.
- Debugging “missing VRF route” must include: is RT advertised in RTC? does RR honor it?

## Verification

```text
show bgp ipv4 rt-filter
show bgp vpnv4 unicast neighbors 192.0.2.1 routes
! compare with/without RTC interest
show bgp vpnv4 unicast summary
```

## Interview framing

“RTC lets PEs advertise the RTs they import so RRs only send matching VPN routes—critical for scale when each PE holds a small fraction of all VPNs.”

---
