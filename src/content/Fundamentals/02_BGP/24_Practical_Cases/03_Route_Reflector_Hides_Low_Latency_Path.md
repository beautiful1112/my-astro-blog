# Case: Route Reflector Hides the Low-Latency Path

## Scenario

Two edges learn the same VIP: Edge-A (low-latency exchange) and Edge-B (cheaper transit). The RR prefers Edge-B (higher RID / IGP quirks / LP tie). Clients only receive Edge-B’s path. Strategies miss the low-latency exit.

## Expected evidence

```text
! On RR:
show bgp ipv4 unicast <vip>
! two paths; best is Edge-B
! On client:
show bgp ipv4 unicast <vip>
! only Edge-B path present
```

## Config touchpoints

- Align LOCAL_PREF so Edge-A wins when that is intent.
- Or enable ADD-PATH / diverse-path so clients see both.
- Or place clients in a topology that peers with both edges for that VIP class.

```text
neighbor <client> capability additional-paths send
neighbor <client> advertise additional-paths best 2
```

## Verification

Clients list both paths (or the intended best). Active latency probe matches Edge-A when LP prefers A.

## Lesson

RR advertises its best (unless ADD-PATH). Path hiding is by design—see [Interview](../25_Interview_Questions/10_Route_Reflector_Path_Hiding.md).
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
