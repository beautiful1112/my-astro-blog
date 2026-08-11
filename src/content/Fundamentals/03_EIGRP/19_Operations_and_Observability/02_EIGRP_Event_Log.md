# EIGRP event log

The **EIGRP event log** is a circular buffer of DUAL and neighbor-significant events. It is often more useful than packet debug for post-mortem of Active/SIA and adjacency changes.

## Access

```text
show ip eigrp events
show ip eigrp events <keyword>
! named:
show eigrp address-family ipv4 events
```

Clear carefully during labs:

```text
clear ip eigrp events
```

## What to look for

| Event class | Meaning |
|---|---|
| Neighbor up/down | Adjacency change |
| Peer restart | Capability/reset |
| Active / reply | Query lifecycle |
| SIA | Active timer expired |
| Stub peer | Stub-related handling |
| Metric change | Path cost updates |

Correlate timestamps with syslog and interface counters.

## Workflow

1. Note time of user-reported loss.
2. `show ip eigrp events` around that window.
3. Identify prefix stuck Active and which neighbor failed to reply.
4. Inspect that neighbor’s CPU, link errors, stub config, filters.
5. Only then consider targeted debug.

```text
Symptom time --> Event log
E --> Suspect neighbor
N --> Link/CPU/stub
```

## Limits

- Buffer size finite—old events rotate out.
- Not a full packet capture.
- Interpreting DUAL messages needs FD/RD literacy.

## Verification during known change

Before/after a summary or stub change, capture events while withdrawing a test prefix; confirm query fanout matches design (spokes not queried).

## Interview framing

“Use the EIGRP event log to reconstruct Active/SIA and neighbor timelines before enabling packet debug.”

## Retention tip

Copy `show ip eigrp events` into the ticket immediately—the buffer will rotate under ongoing SIA and you will lose the first culprit neighbor.

## Related

- [Debug Strategy](03_Debug_Strategy.md)
- [Active and SIA](../20_Troubleshooting/06_Active_and_SIA.md)
- [Essential Show Commands](01_Essential_Show_Commands.md)

---
