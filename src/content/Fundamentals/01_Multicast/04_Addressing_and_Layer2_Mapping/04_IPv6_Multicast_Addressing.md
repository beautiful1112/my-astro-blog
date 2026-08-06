# IPv6 multicast addressing

IPv6 multicast is `ff00::/8`:

```text
| 8 bits FF | 4-bit flags 0RPT | 4-bit scope | 112-bit group ID |
```

Common scopes are interface-local `1`, link-local `2`, admin-local `4`, site-local `5`, organization-local `8`, and global `e`. IPv6 SSM uses `ff3x::/32`, where `x` is scope.

IPv6 multicast maps to Ethernet `33:33:` plus the low 32 destination bits, also creating many-to-one aliases.

Neighbor Discovery uses solicited-node groups in `ff02::1:ff00:0/104`; broken MLD snooping can therefore break ordinary IPv6 reachability even without a user multicast application.

