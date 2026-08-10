# Router ID

EIGRP uses a **32-bit Router ID (RID)**, written in dotted-decimal like an IPv4 address. The RID identifies the router in EIGRP control-plane contexts (including external route attribution and IPv6 EIGRP operation). It is **not** automatically the forwarding next hop and need not be a reachable loopback—though using a stable configured loopback-style value is operationally wise.

## Selection and requirements

| Topic | Practice |
|---|---|
| Explicit config | `eigrp router-id` (classic or under AF) |
| Default behavior | Often highest active IPv4 address if unset—risky across reloads/if flaps |
| IPv6 EIGRP | **RID required**; IPv6-only boxes must set a 32-bit RID manually |
| Uniqueness | Duplicate RIDs cause confusing external/origin attribution; avoid |

```text
Good:  eigrp router-id 192.0.2.1   (stable, unique, documented)
Bad:   rely on a transient interface address that disappears
```

Related: [Address families overview](03_Address_Families_Overview.md), [What EIGRP is](../02_Fundamentals/01_What_EIGRP_Is.md).

## Where you see RID matter

- Troubleshooting “who originated this external.”
- IPv6 EIGRP process start failure when no IPv4 address exists to derive RID.
- Migrations where two routers accidentally share the same auto-picked pattern.

RID collision does **not** always prevent neighbor formation the way OSPF duplicate RID in the same area can—but it still creates operational ambiguity. Treat uniqueness as mandatory hygiene.

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
router eigrp 100
 eigrp router-id 192.0.2.1
 network 10.0.0.0 0.0.255.255
```

### Cisco IOS / IOS XE — named

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  eigrp router-id 192.0.2.1
 exit-address-family
 address-family ipv6 unicast autonomous-system 100
  eigrp router-id 192.0.2.1
 exit-address-family
```

Set RID under **each** AF you care about; do not assume inheritance without checking the image.

## Verification

```text
show ip protocols
show ip eigrp topology
show eigrp protocols
```

Look for Router-ID in protocol output. On IPv6-only labs, shut all IPv4 addresses, clear RID, and watch the IPv6 AF fail until RID is configured.

## Risks

- Auto RID changing after interface renumber → hard-to-explain topology diffs.
- IPv6 EIGRP down with vague logs because RID missing.
- Using a public/reachable address that later moves to another device.

## Interview framing

“EIGRP’s router ID is a 32-bit identifier—configure it stably on every AF, and always set it for IPv6 EIGRP because there may be no IPv4 address to derive from.”

---
