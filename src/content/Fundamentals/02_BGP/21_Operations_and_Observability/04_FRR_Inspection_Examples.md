# FRRouting Inspection Examples

FRR (`vtysh`) is common in labs, whiteboxes, and some trading edges. Prefer JSON for automation; human text formats drift between releases.

## Human-readable inspection

```text
show bgp summary
show bgp neighbors 192.0.2.1
show bgp ipv4 unicast 203.0.113.0/24
show bgp ipv4 unicast neighbors 192.0.2.1 routes
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
show ip route 203.0.113.0/24
show ip route bgp
```

## Automation-friendly JSON

```text
show bgp summary json
show bgp ipv4 unicast 203.0.113.0/24 json
show bgp neighbors 192.0.2.1 json
```

Validate missing keys and multipath arrays; do not parse fixed-width columns in CI.

## Soft policy and refresh

```text
clear bgp 192.0.2.1 soft in
clear bgp 192.0.2.1 soft out
```

Soft-reconfiguration inbound (if configured) is required for true pre-policy dumps on some builds—see [Soft Reconfiguration vs Refresh](../07_RIBs_and_Updates/05_Soft_Reconfiguration_vs_Refresh.md).

## Multipath / bandwidth notes

When [link-bandwidth](../11_Policy_and_Traffic_Engineering/11_Link_Bandwidth_Community.md) or unequal-cost multipath is enabled, confirm multiple paths in Loc-RIB **and** weighted entries in the FIB—not only a single best path.

```text
show bgp ipv4 unicast 203.0.113.0/24 json
show ip route 203.0.113.0/24 json
```

## Incident workflow mapping

| Inspection step | FRR view |
|---|---|
| Session | `show bgp neighbors` / `… json` |
| Accepted | `show bgp ipv4 unicast neighbors <p> routes` |
| Best | `show bgp ipv4 unicast <prefix>` |
| Installed | `show ip route <prefix>` |
| Advertised | `… advertised-routes` |

Automate VIP watches by polling JSON for `bestpath` and next-hop changes; page on unexpected best-path flips outside maintenance windows.

---
