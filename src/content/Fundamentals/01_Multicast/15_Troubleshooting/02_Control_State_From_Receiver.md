# Follow control state from receiver upstream

Walk interest signaling from the host to the tree root. An IGMP Report proves only local interest—not that data can arrive.

1. Did the socket join the intended interface?
2. Is the IGMP/MLD Report visible on the access link?
3. Does the switch have the listener and mrouter ports?
4. Does the LHR have local membership and receiver OIF?
5. For SSM, does `(S,G)` Join state propagate toward `S`?
6. For ASM, is RP mapping correct and does `(*,G)` state propagate toward the RP?

Related: [Define the flow](01_Define_the_Flow.md), [Membership lifecycle lab](../18_Labs/02_Membership_Lifecycle.md), [No querier lab](../18_Labs/03_No_Querier.md).

## Upstream ladder

```text
App setsockopt join
  -> host IGMP Report
    -> snooping table + mrouter port
      -> LHR IGMP cache + OIL toward receiver
        -> PIM Join hop-by-hop (toward S or RP)
          -> state at FHR / RP
```

Stop at the first missing rung.

## Configuration patterns (show / capture)

### Linux

```text
cat /proc/net/igmp
ip maddr show dev eth0
tcpdump -ni eth0 -vv igmp
```

### Cisco switch / LHR

```text
show ip igmp snooping groups vlan 100
show ip igmp snooping mrouter vlan 100
show ip igmp groups 232.10.10.10
show ip mroute 192.0.2.10 232.10.10.10
show ip pim neighbor
show ip rpf 192.0.2.10
```

### Junos

```text
show igmp group 232.10.10.10
show pim join extensive
show pim neighbor
```

### FRR

```text
show ip igmp
show ip mroute
show ip pim neighbor
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Querier absence** | State expires after working initially ([case](../16_Practical_Cases/01_Same_VLAN_No_Router.md)) |
| **IGMP filter** | Report ignored—empty groups |
| **Wrong VRF** | Join in one table; data RPF in another |

## Verification checklist

- [ ] Join on correct ifindex  
- [ ] Report on wire with expected version (v3 INCLUDE for SSM)  
- [ ] Snooping entry + mrouter  
- [ ] LHR OIL includes receiver interface  
- [ ] PIM neighbor toward RPF  
- [ ] Join flags/timers alive toward S or RP  

Practical: [Fast leave blackhole](../16_Practical_Cases/05_Fast_Leave_Blackhole.md), [SSM across VLANs](../16_Practical_Cases/02_SSM_Across_VLANs.md).

## Risks

- Assuming `show ip mroute` on a core node without confirming LHR membership.
- Debugging ASM RP when the client issued an SSM join (or vice versa).

## Interview framing

“From the receiver: socket join → IGMP on the wire → snooping → LHR OIL → PIM Joins toward S or RP; a Report alone never proves the tree.”

---
