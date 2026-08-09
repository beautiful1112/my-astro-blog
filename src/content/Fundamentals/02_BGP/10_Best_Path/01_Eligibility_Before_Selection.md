# Eligibility Before Best-Path Selection

Best-path comparison starts only after a route is **eligible**. Many “why did B lose?” incidents are wrong questions: B never entered the decision set.

## Common reasons a path is excluded

| Gate | Typical cause |
|---|---|
| Not received | Capability/AF inactive, ORF, session not Established |
| Import policy reject | Prefix/AS-path/community/RPKI policy |
| Invalid NLRI/attributes | Malformed UPDATE; treat-as-withdraw |
| NEXT_HOP unresolved | Missing IGP/static/tunnel to BGP next hop |
| AS-loop detection | Local ASN in AS_PATH ([AS_PATH](../08_Path_Attributes/03_AS_PATH_and_Loop_Prevention.md)) |
| RPKI Invalid + reject policy | Origin validation drop |
| Cluster list / RR loop | Reflection loop attributes |
| Dampening suppress | Flap penalty active |
| VRF / RT mismatch | VPN route not imported |

Only eligible paths form the meaningful candidate set for [best-path selection](02_Vendor_Neutral_Selection_Model.md).

## Troubleshooting order

1. **Received** — Adj-RIB-In / `neighbors … routes` / soft-reconfig / BMP  
2. **Accepted** — import policy  
3. **Eligible** — next hop, validation, loops  
4. **Best** — decision process  
5. **Installed** — RIB/FIB vs AD / overlapping routes  
6. **Advertised** — export policy / split horizon  

## Configuration aids

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.1 soft-reconfiguration inbound
!
show ip bgp neighbors 192.0.2.1 received-routes
show ip bgp neighbors 192.0.2.1 routes
show ip bgp 192.0.2.0/24
! Look for "Inaccessible" next hop / RPKI state / (received-only)
```

### Junos

```text
show route receive-protocol bgp 192.0.2.1
show route 192.0.2.0/24 extensive
# Hidden routes often indicate next-hop or policy issues
show route hidden extensive
```

### FRRouting

```text
show bgp ipv4 unicast neighbors 192.0.2.1 received-routes
show bgp ipv4 unicast neighbors 192.0.2.1 routes
show bgp ipv4 unicast 192.0.2.0/24
```

## Interactions

| Mechanism | Interaction |
|---|---|
| soft-reconfiguration / route-refresh | Lets you see received vs post-policy |
| ORF | Peer may never send the NLRI ([ORF](../11_Policy_and_Traffic_Engineering/09_ORF.md)) |
| allowas-in | Changes AS-loop eligibility ([allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md)) |
| Conditional advertisement | Affects export eligibility, not import best-path |

## Risks

- Comparing best-path attributes on a path that is still policy-rejected.
- Enabling allowas-in or disabling RPKI reject to “make it eligible” without fixing design.
- Ignoring hidden/inaccessible next hops while chasing MED/LOCAL_PREF myths.

## Interview framing

“Selection only runs on eligible paths—policy, next-hop resolution, AS-loop, and validation gates come first; troubleshoot received → accepted → eligible → best → installed → advertised.”

---
