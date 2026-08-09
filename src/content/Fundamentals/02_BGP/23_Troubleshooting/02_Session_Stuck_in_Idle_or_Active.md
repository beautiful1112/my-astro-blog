# Session Stuck in Idle or Active

Idle/Active means TCP 179 or OPEN negotiation is failing—not a best-path problem.

## Checklist

1. Local and remote IP reachability (and recursive reachability for loopback peering).
2. Correct `update-source` / local address; multihop TTL / eBGP multihop / GTSM.
3. ACL / CoPP allowing TCP 179 both ways.
4. MD5 / TCP-AO key match.
5. ASN mismatch (`local-as` / dual-AS migration surprises)—see [local-as](../12_eBGP_and_iBGP/08_Local_AS.md).
6. Passive vs active role; collision races on simultaneous opens.
7. `disable-connected-check` / backdoor network only when intentional ([related](../12_eBGP_and_iBGP/10_Disable_Connected_Check_Backdoor_Network.md)).

## Evidence

```text
show bgp ipv4 unicast neighbors 192.0.2.1
! Last state, last reset, notification reason
ping / traceroute to peer IP with correct source
tcpdump -nn 'tcp port 179'
```

## Common outcomes

| Observation | Likely cause |
|---|---|
| SYN with no SYN-ACK | ACL, routing to peer IP, wrong VRF |
| SYN-ACK then RST | AO/MD5 fail, ACL mid-handshake |
| OPEN then NOTIFICATION bad peer AS | ASN / local-as mismatch |
| Flap Idle↔Active | Unstable underlay to loopback |

Do not debug prefix policy until Established with expected capabilities.

## Multihop / loopback checklist

```text
neighbor 192.0.2.1 update-source Loopback0
neighbor 192.0.2.1 ebgp-multihop 2   ! or TTL-security
! IGP must reach both loopbacks before BGP will stay Established
```

If using `local-as`, confirm the OPEN ASN the peer expects matches the knobs (`no-prepend` / `replace-as` variants)—see [local-as](../12_eBGP_and_iBGP/08_Local_AS.md).

---
