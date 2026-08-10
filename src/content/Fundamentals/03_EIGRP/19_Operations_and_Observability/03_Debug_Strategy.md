# Debug strategy

**Never** start with `debug eigrp packet` on a busy hub. Broad packet debug can spike CPU, drop hellos, and create the outage you are investigating.

## Principles

1. Evidence from `show` commands first.
2. Scope debug to **neighbor**, **packet type**, or **interface** when the platform allows.
3. Use ACL filters for debug where supported.
4. Enable briefly; `undebug all` when done.
5. Prefer event log + packet capture off-box for WAN hubs.

## Targeted examples

```text
debug eigrp packets hello
debug eigrp packets query reply
debug eigrp fsm
debug eigrp neighbor
!
undebug all
```

For classic IOS, combine with:

```text
logging console critical
logging buffered 1000000 debugging
terminal monitor
! only on dedicated session
```

## Decision tree

| Hypothesis | Debug / evidence |
|---|---|
| Auth / hello | `debug eigrp packets hello` + capture |
| Stuck Active | events + `topology active` first |
| Filter deny | `show ip protocols` / route-map counters |
| Metric odd | interfaces detail + topology — usually no debug |

## Production safety

| Do | Do not |
|---|---|
| Debug on spoke in maintenance | Debug all packets on core |
| Remote SPAN + Wireshark | Leave debug on overnight |
| CPU watched (`show proc cpu`) | Multiple debugs stacked |

If CPU climbs, remove debug immediately—even mid-thought.

## Interview framing

“Show commands and the event log first; targeted hello/query debug second; never blind `debug all` on EIGRP hubs.”

## Off-box alternative

SPAN/ERSPAN the WAN interface to Wireshark with display filter `ip.proto == 88`. Often safer than on-box debug for hello/auth disputes.

## Related

- [EIGRP Event Log](02_EIGRP_Event_Log.md)
- [Troubleshooting Framework](../20_Troubleshooting/01_Troubleshooting_Framework.md)
- [Neighbors Not Forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md)

---
