# Operational auth failures

Authentication problems rarely present as “bad metric.” They present as **neighbors never form**, **neighbors drop**, or intermittent adjacency when key lifetimes expire.

## Symptom → likely cause

| Symptom | Likely cause |
|---|---|
| No adjacency; hellos seen in capture without valid digest | Key-string mismatch |
| No adjacency; one side auth enabled | Auth on only one peer |
| Worked for months, then died at midnight | `send-lifetime` / `accept-lifetime` expiry |
| One peer of many fails | Wrong key-id on that link / VRF |
| MD5 vs SHA mismatch | Mode disagreement (named vs classic) |
| All good after reload until NTP syncs | Clock jump invalidates lifetimes |

## Evidence checklist

```text
show key chain
show ip eigrp interfaces detail
show ip eigrp neighbors
show logging | include EIGRP|auth|key
! packet capture: IP proto 88, compare both ends
show clock
show ntp status
```

Compare **key-id in use for send** on each side. Accept may allow multiple keys while send uses only one active key.

## Debug (targeted)

```text
debug eigrp packets hello
! look for auth failure indications
undebug all
```

Never leave broad packet debug on production cores. Prefer interface-scoped debug where supported.

## Recovery patterns

1. **Mismatch during change**: temporarily align both to a known good key (out-of-band agreed), restore adjacency, then redo rollover with overlap.
2. **Lifetime expiry**: extend accept-lifetime immediately; fix NTP; schedule proper dual-key rollover.
3. **One-sided auth**: enable matching auth on the peer or remove auth on both (emergency only).

## Change-window checklist

- [ ] NTP OK on all peers
- [ ] New key accept-lifetime already active everywhere
- [ ] Send moved in defined order
- [ ] Neighbor uptime verified after each stage
- [ ] Old key removed only after soak

## Interview framing

“EIGRP auth failures look like missing neighbors, not bad routes—check key-string, key-id, mode, and lifetime against NTP before chasing K-values.”

## Escalation package

When handing off: key chain show both ends, clock/NTP, interface auth mode lines, neighbor table, and a 30-second hello capture. That package avoids repeated “try rekey” thrash.

## Related

- [MD5 Authentication and Key Chains](02_MD5_Authentication_and_Key_Chains.md)
- [Auth Key Rollover Outage](../21_Practical_Cases/07_Auth_Key_Rollover_Outage.md)
- [Neighbors Not Forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md)

---
