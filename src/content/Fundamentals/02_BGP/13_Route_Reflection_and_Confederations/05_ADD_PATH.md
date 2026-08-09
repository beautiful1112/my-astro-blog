# BGP ADD-PATH

RFC 7911 lets a speaker advertise **multiple paths for the same NLRI** by attaching a local **Path Identifier**. Send and receive capabilities are negotiated **per AFI/SAFI**. ADD-PATH is the primary cure for route-reflector path hiding.

## Mechanism

1. Peers negotiate ADD-PATH send and/or receive for a family.
2. The advertiser may send several MP_REACH (or classic) updates for one prefix, each with a distinct Path ID.
3. The receiver treats them as separate paths in Adj-RIB-In / Loc-RIB candidate set.
4. Withdrawals are per Path ID; replacing the best path does not implicitly withdraw other Path IDs.

Path IDs identify advertisements **locally on that session**. They are not globally stable path UUIDs and should not be compared across peers.

## What “send multiple paths” means

ADD-PATH does **not** mean “flood every path.” Common send policies:

| Mode | Typical use |
|---|---|
| Best + N backups | Convergence / PIC |
| All paths | Max diversity, high cost |
| Group-best / diverse nexthop | ECMP and exit diversity |
| Multipath-eligible only | Limit to installable set |

Platform knobs name these differently (`additional-paths select best 2`, `advertise-all`, etc.).

## Configuration patterns

### Cisco IOS XR (conceptual)

```text
router bgp 65000
 address-family ipv4 unicast
  additional-paths receive
  additional-paths send
  additional-paths selection route-policy ADD-PATH-SEL
 neighbor-group RR-CLIENTS
  address-family ipv4 unicast
   additional-paths receive
   additional-paths send
```

### Junos

```text
set protocols bgp group RR-CLIENTS family inet unicast add-path receive
set protocols bgp group RR-CLIENTS family inet unicast add-path send path-count 4
```

### FRR

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 192.0.2.11 additional-paths receive
  neighbor 192.0.2.11 additional-paths send
  bgp additional-paths select all
 exit-address-family
```

Negotiate on **both** RR and clients for each family that needs diversity (IPv4, VPNv4, EVPN, …).

## Interactions

| Mechanism | Relationship |
|---|---|
| **Route reflection** | Primary consumer—RR sends multiple paths to clients |
| **Path hiding** | Direct mitigation |
| **BGP multipath** | Client can install several received next hops |
| **PIC / FRR** | Prefers pre-advertised backups |
| **Maximum-prefix** | Count may include additional paths—raise limits deliberately |
| **Route-Target Constraint** | Orthogonal; RTC reduces RT membership, ADD-PATH multiplies paths per NLRI |

## Verification

```text
show bgp ipv4 unicast neighbors 192.0.2.11 | include Additional
show bgp ipv4 unicast <prefix>
! multiple paths with path-ids
show bgp vpnv4 unicast vrf CUST <prefix>
```

Confirm Path ID capability in OPEN, multiple entries in the client RIB, and that after primary PE failure the backup next hop is already present.

## Costs and risks

- Memory and CPU grow with path count × prefix count.
- UPDATE storms on mass churn (fiber cut advertising thousands of PE paths).
- Misconfigured send-all on Internet full tables can overwhelm edge routers.
- Inconsistent ADD-PATH modes across redundant RRs yield asymmetric client RIBs.

## Interview framing

“ADD-PATH negotiates the ability to advertise multiple paths per NLRI with Path IDs so an RR can expose backups and eliminate classic path hiding—at the cost of more state and UPDATE load.”

---
