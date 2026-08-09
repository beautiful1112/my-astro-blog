# Case: IXP Route-Server Session Up, Data Plane Down

## Scenario

BGP to the route server is Established; many prefixes installed with NEXT_HOP = bilateral peer MAC/IP on the IX fabric. Ping to a peer prefix fails. Operators blame BGP policy.

## Expected evidence

```text
show bgp ipv4 unicast <prefix>
! NH = 192.0.2.50 (peer on IX LAN), next-hop-unchanged path
ping 192.0.2.50                 # may fail — L2/fabric/ACL
ping <prefix>                  # fails
# RS session healthy the whole time
```

Route servers do not forward packets. Data plane is bilateral on the IX fabric.

## Config touchpoints

- [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md) toward RS is expected.
- Verify IX MAC learning, port ACLs, storm control, and bilateral physical.
- Optional bilateral BGP session as backup to RS.

## Verification

Fix fabric/ACL; ARP/ND resolves; CEF to NH completes; traffic flows without RS involvement in forwarding. See [Route Server Behavior](../20_Advanced_Families/07_Route_Server_Behavior.md).

## Lesson

RS control plane ≠ RS data plane. Debug the IX LAN next hop.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
