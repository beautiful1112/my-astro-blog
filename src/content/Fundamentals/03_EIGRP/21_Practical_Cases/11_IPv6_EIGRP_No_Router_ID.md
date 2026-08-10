# Case: IPv6 EIGRP no router ID

## Topology

```text
Two routers, IPv6-only interfaces in named EIGRP AF
No IPv4 addresses anywhere; no explicit router-id
```

## Symptom

IPv6 EIGRP process does not form neighbors / topology stays empty. Engineer verifies K-values and link-locals; still broken. IPv4 EIGRP on another lab works fine.

## Evidence

```text
show eigrp address-family ipv6 neighbors
! empty
show eigrp address-family ipv6
! Router-ID: 0.0.0.0   or process not fully up
show ipv6 interface brief
! no global IPv4
```

Some code paths log inability to select an EIGRP router ID.

## Root cause

EIGRP still needs a **32-bit router ID**. On IPv4 routers it is picked from IPv4 interfaces. On IPv6-only boxes with no IPv4 address, automatic RID selection fails unless configured.

## Fix

```text
router eigrp CORP
 address-family ipv6 unicast autonomous-system 100
  eigrp router-id 192.0.2.1
  ! unique per device
  af-interface GigabitEthernet0/0
   no passive-interface
  exit-af-interface
  topology base
   exit-af-topology
```

Use a unique documented RID space (even if not routed). Verify neighbors come up on link-local.

```text
show eigrp address-family ipv6 neighbors
show eigrp address-family ipv6
```

## Interview takeaway

“IPv6-only EIGRP still needs an explicit 32-bit router-id when no IPv4 address exists to self-select.”

## Related

- [IPv6 EIGRP module](../14_IPv6_EIGRP/)
- [Neighbors Not Forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md)

---
