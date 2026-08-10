# Neighbors not forming

Primary symptom: expected peer absent from `show ip eigrp neighbors`. Do not chase metrics yet.

## Checklist (order matters)

1. **L3 reachability** — ping neighbor IP on the common subnet / tunnel.
2. **Same ASN** — classic process or named AF autonomous-system.
3. **K-values identical** — mismatch = silent refusal ([case](../21_Practical_Cases/01_K_Values_Mismatch_Silent.md)).
4. **Authentication** — mode, key-id, key-string, lifetimes.
5. **Passive-interface** — transit must be `no passive`.
6. **Network / AF statement** — interface IP matched.
7. **ACL / CoPP** — IP protocol 88 permitted.
8. **Static neighbor** — required peer listed on NBMA.
9. **Timers** — hello/hold incompatible extremes (rare vs above).
10. **Primary IP / secondary** — EIGRP source expectations.

## Evidence

```text
show ip eigrp neighbors
show ip eigrp interfaces detail
show ip protocols | section eigrp
show key chain
show access-lists
ping <neighbor>
show interface <if> | include up|BW|Dly
```

Packet capture: hellos both ways? Digest present? AS TLV match?

## Config touchpoints

```text
router eigrp 100
 metric weights 0 1 0 1 0 0
 network 10.0.0.0 0.0.0.255
 no passive-interface GigabitEthernet0/0
!
interface GigabitEthernet0/0
 ip authentication mode eigrp 100 md5
 ip authentication key-chain eigrp 100 EIGRP-KEYS
```

## Quick isolation

| Observation | Likely cause |
|---|---|
| Hellos TX only | ACL inbound / peer not running EIGRP |
| Hellos both ways, no adj | K-values / auth / AS |
| Works without auth, fails with | Key mismatch |
| OK on LAN, fail on tunnel | BW/MTU/NHRP/multicast |

## Interview framing

“No neighbor means AS, K-values, auth, passive, ACL, or L3—verify before touching variance or redistribution.”

## Secondary IP gotcha

EIGRP may source hellos from the primary address. Peers expecting a secondary, or ACLs keyed to the wrong IP, fail adjacency while “ping to secondary” works. Align primary addressing with neighbor statements.

## Related

- [Operational Auth Failures](../16_Authentication_and_Security/06_Operational_Auth_Failures.md)
- [K-Values Mismatch Silent](../21_Practical_Cases/01_K_Values_Mismatch_Silent.md)
- [Passive Interface as Control](../16_Authentication_and_Security/05_Passive_Interface_as_Control.md)

---
