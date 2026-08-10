# Router ID requirement

EIGRP for IPv6 **requires an explicit 32-bit router ID**. Unlike IPv4 EIGRP (which can auto-pick from IPv4 interfaces), IPv6-only boxes or IPv6 AFs without usable IPv4 addresses will **not** form proper adjacencies until a RID is configured.

## Configuration

### Named mode

```text
router eigrp CORP
 address-family ipv6 unicast autonomous-system 100
  eigrp router-id 1.1.1.1
 exit-address-family
```

### Classic IPv6

```text
ipv6 router eigrp 100
 eigrp router-id 1.1.1.1
 no shutdown
```

Use a unique RID per router (often the IPv4 loopback in dotted-decimal). RID collisions confuse topology identification and troubleshooting even if hellos seem up.

## Why 32-bit on IPv6?

EIGRP TLV/internal identification historically uses a 32-bit RID field shared with the IPv4 world—IPv6 AF reuses that identifier space. It is **not** an IPv6 address.

## Verification

```text
show eigrp address-family ipv6
show ipv6 eigrp neighbors
! Confirm RID displayed; neighbors Established
```

## Ops failure mode

Symptom: interfaces enabled for IPv6 EIGRP, timers look fine, **no neighbors**. Root cause often missing RID or process shut. Check RID before chasing ACLs.

## RID hygiene

- Pin RID to a documented loopback IPv4 address even on IPv6-heavy boxes.
- Change RID only in a window—neighbors may reset or topology origins look inconsistent in show output.
- Never duplicate RID inside the same AS/AF.

```text
! Bad: two routers both using 1.1.1.1 as EIGRP RID
! Good: RID equals each router's unique Loopback0 IPv4
```

## Interview framing

“IPv6 EIGRP needs a configured 32-bit router-id; auto-selection may be unavailable without IPv4 addresses.”

## Related

- [Classic IPv6 router EIGRP](04_Classic_IPv6_Router_EIGRP.md)
- [Named mode IPv6](03_Named_Mode_IPv6.md)
- [IPv6 verification](06_IPv6_Verification.md)

---
