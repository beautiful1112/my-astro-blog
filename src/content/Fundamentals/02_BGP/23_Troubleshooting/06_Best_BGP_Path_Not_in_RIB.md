# Best BGP Path Not Installed in the RIB

BGP selected a best path, but the main RIB/FIB does not forward with it.

## Typical causes

1. **Unresolved NEXT_HOP** (no recursive route / missing IGP / wrong VRF).
2. **Administrative distance**: static or IGP beats BGP (often AD 20 eBGP vs 1 static / 110 OSPF).
3. **RIB failure / table-map** filtering installation.
4. **Label / VRF / EVPN** programming failure despite control-plane best.
5. **Non-permanent RIB** features or dampening side effects (platform-specific).

## Evidence

```text
show bgp ipv4 unicast 203.0.113.0/24
! best path marked; next hop address
show ip route 203.0.113.0
show ip route 192.0.2.1   ! recurse next hop
show ip cef 203.0.113.1 detail
```

If BGP is best in Loc-RIB but `show ip route` shows static, either remove/fix the static or accept that AD wins—see [case](../24_Practical_Cases/11_Best_BGP_Route_Loses_to_Static.md).

For iBGP-learned external routes, missing [next-hop-self](../12_eBGP_and_iBGP/03_Next_Hop_Self.md) (or IGP reachability to the eBGP NH) is the classic unresolved-NH failure mode.
## Quick matrix

| `show bgp` | `show ip route` | Next action |
|---|---|---|
| best, NH inaccessible | missing / incomplete | Fix recursion / next-hop-self |
| best | static wins | AD / remove static |
| best | BGP present | Check CEF/hardware |


---
