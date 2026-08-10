# Static neighbors hardening

By default EIGRP discovers peers with multicast hellos (`224.0.0.10`). Configuring **static neighbors** switches that interface to **unicast** hellos/updates toward listed addresses and typically suppresses multicast peering on that interface.

## When to use

| Use case | Benefit |
|---|---|
| NBMA multipoint (Frame Relay, some mGRE) | Avoid unreliable multicast |
| Hardening | Only listed IPs can peer |
| Mixed segments | Prevent accidental access-layer adjacencies |

Trade-off: every new peer needs a config change; forgotten static neighbor = “EIGRP won’t come up.”

## Classic configuration

```text
router eigrp 100
 neighbor 203.0.113.2 GigabitEthernet0/0
 neighbor 203.0.113.3 GigabitEthernet0/0
!
interface GigabitEthernet0/0
 ! bandwidth / delay correct for metric
```

## Named mode

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  neighbor 203.0.113.2 GigabitEthernet0/0
```

## Interaction with multicast

Once a static neighbor exists on an interface, expect unicast-only behavior toward configured peers. Do not assume dynamic neighbors can still form on the same interface—verify platform docs and `show ip eigrp interfaces detail`.

## Pair with ACLs / CoPP

```text
! example: permit EIGRP (88) only from known peers
access-list 100 permit eigrp host 203.0.113.2 host 203.0.113.1
access-list 100 permit eigrp host 203.0.113.3 host 203.0.113.1
access-list 100 deny eigrp any any
access-list 100 permit ip any any
interface GigabitEthernet0/0
 ip access-group 100 in
```

Static neighbors reduce accidental peering; ACLs reduce spoofed protocol 88 from other hosts.

## Verification

```text
show ip eigrp neighbors
show ip eigrp interfaces detail
! Hello interval / unicast neighbor list
debug eigrp packets hello
! carefully: unicast hellos to static peers
```

## Risks

- Adding a physical peer without `neighbor` statement.
- Static neighbor + split-horizon issues on multipoint still apply ([NBMA](../17_WAN_NBMA_and_Tunnels/02_NBMA_and_Multipoint.md)).
- Scaling: large static lists are operationally heavy—prefer design that uses point-to-point subinterfaces.

## Interview framing

“Static EIGRP neighbors force unicast peering to listed addresses—useful on NBMA and for hardening—but every peer must be explicitly configured.”

## Related

- [Static Neighbors on NBMA](../17_WAN_NBMA_and_Tunnels/03_Static_Neighbors_on_NBMA.md)
- [Passive Interface as Control](05_Passive_Interface_as_Control.md)
- [Why Authenticate EIGRP](01_Why_Authenticate_EIGRP.md)

---
