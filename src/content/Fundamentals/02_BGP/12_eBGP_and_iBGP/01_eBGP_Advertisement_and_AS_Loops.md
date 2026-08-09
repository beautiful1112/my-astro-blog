# eBGP Advertisement and AS Loops

When exporting a route to eBGP, a speaker normally:

1. Applies **export authorization** (default-reject / valley-free).  
2. **Prepends its ASN** to AS_PATH.  
3. Sets **NEXT_HOP** to itself on a directly connected session (unless third-party / unchanged designs).  
4. Advertises the **best** path unless ADD-PATH or multipath advertisement features apply.

The receiver rejects a route containing its **own ASN**, preventing the advertisement from circling back through the interdomain topology ([AS_PATH](../08_Path_Attributes/03_AS_PATH_and_Loop_Prevention.md)).

## Deliberate loop-related exceptions

| Feature | Direction | Purpose |
|---|---|---|
| [allowas-in](06_AllowAS_In.md) | Import | Accept N copies of local ASN |
| [as-override](07_AS_Override.md) | PE→CE export | Rewrite customer ASN so remote same-ASN CE accepts |
| [Local AS](08_Local_AS.md) | Session identity | Migration / dual-ASN appearance |
| remove-private-as | Export | Strip private ASNs before public eBGP |

Scope these narrowly; they weaken assumptions behind standard AS-loop prevention. In VPNs, prefer **SoO** for site-loop control.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 address-family ipv4
  neighbor 192.0.2.1 route-map TO-PEER out
  neighbor 192.0.2.1 route-map FROM-PEER in
 exit-address-family
!
! Lab observation of prepend on egress:
! show ip bgp neighbors 192.0.2.1 advertised-routes
```

### Junos

```text
set protocols bgp group EXT type external
set protocols bgp group EXT peer-as 64496
set protocols bgp group EXT export TO-PEER
set protocols bgp group EXT import FROM-PEER
```

### FRRouting

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 192.0.2.1 route-map TO-PEER out
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| iBGP | No local ASN prepend; needs split horizon / RR |
| Confederations | eBGP-like between member ASNs with special AS_PATH segments |
| TTL security / GTSM | Session protection; orthogonal to AS_PATH |
| Multihop eBGP | Still prepends ASN; next-hop and TTL differ |

## Verification

```text
show ip bgp neighbors 192.0.2.1 advertised-routes
show ip bgp 203.0.113.0/24
! On receiver: path with own ASN should be denied unless allowas-in
show ip bgp regexp _65000_
```

## Risks

- Accidental transit creating real AS loops that look like “mystery denies.”
- enable allowas-in on Internet-facing sessions.
- remove-private-as hiding customer path structure that operations still need.

## Interview framing

“eBGP prepends local ASN and receivers reject their own ASN; features like allowas-in and as-override are scoped exceptions for VPN/migration designs, not general Internet practice.”

---
