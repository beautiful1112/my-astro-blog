# Junos BGP Inspection Examples

Junos separates protocol RIB views from inet.0 / forwarding more explicitly than classic IOS. Always name the table (inet.0, inet6.0, bgp.l3vpn.0, VRF instance).

## Session and neighbor

```text
show bgp summary
show bgp neighbor 192.0.2.1
show bgp group EDGE detail
```

Check flap history, negotiated options (4-byte AS, refresh, GR, ADD-PATH), and prefix limits.

## Receive / advertise / selection

```text
show route receive-protocol bgp 192.0.2.1
show route advertising-protocol bgp 192.0.2.1
show route 203.0.113.0/24 detail
show route protocol bgp table inet.0 extensive
```

`receive-protocol` answers “did the peer send it?”; `show route … detail` answers “did policy and selection keep it?”

## Forwarding and resolution

```text
show route forwarding-table destination 203.0.113.1
show route resolution unresolved
show route forwarding-table family inet extensive | match 203.0.113
```

Unresolved next hops and missing labels (VPN) appear here even when BGP Loc-RIB looks healthy.

## Policy tracing (scoped)

```text
set protocols bgp group EDGE neighbor 192.0.2.1 traceoptions file bgp-edge size 10m
set protocols bgp group EDGE neighbor 192.0.2.1 traceoptions flag update detail
```

Remove tracing after the window—full UPDATE detail is expensive under churn.

For AIGP-enabled backbones, confirm the metric in detail output—see [AIGP](../08_Path_Attributes/11_AIGP.md). For PE-CE, check `origin:` SoO communities on export toward the site.

## Incident workflow mapping

| Inspection step | Junos view |
|---|---|
| Received | `show route receive-protocol bgp <peer>` |
| Accepted / best | `show route <p> detail` / `extensive` |
| Installed | `show route forwarding-table destination <p>` |
| Advertised | `show route advertising-protocol bgp <peer>` |

When PE-CE SoO is in play, include `show route table <VRF>.inet.0 detail` and confirm `origin:` communities on routes learned from the site. For AIGP backbones, grep detail output for `AIGP` and compare candidates with equal LOCAL_PREF.

---
