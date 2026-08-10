# Case: Auth key rollover outage

## Topology

```text
Core ring R1—R2—R3, EIGRP MD5 key chain SITE-KEYS
Change ticket: rotate key 1 → key 2 at 02:00
```

## Symptom

At 02:00, all adjacencies drop nearly simultaneously. NTP shows correct time. New key-string is correct on all devices—yet neighbors stay down for 40 minutes until emergency `no authentication` workaround.

## Evidence

```text
show key chain SITE-KEYS
! key 1 send-lifetime ended 02:00
! key 2 send-lifetime starts 02:00
! key 2 accept-lifetime starts 02:00   << no overlap before send cutover
show ip eigrp neighbors
! empty
show logging | include auth|EIGRP
```

Clocks matched—so lifetimes expired “correctly” into a window where peers sent key 2 while some devices had not yet loaded the change (or accept did not overlap).

## Root cause

Rollover without **overlapping accept-lifetime**. Valid procedure requires: deploy key 2 accept everywhere first; only then switch send; only later remove key 1. This change switched send at the same instant accept began, with config push skew → no mutual valid key.

## Fix

Emergency: re-extend key 1 accept/send or temporarily disable auth with out-of-band approval.

Proper:

```text
key chain SITE-KEYS
 key 1
  accept-lifetime 00:00:00 Jan 1 2024 00:00:00 Apr 1 2027
  send-lifetime 00:00:00 Jan 1 2024 00:00:00 Jan 15 2027
 key 2
  accept-lifetime 00:00:00 Jan 1 2027 infinite
  send-lifetime 00:00:00 Jan 15 2027 infinite
```

Stage: (1) push key2 accept, (2) verify, (3) enable key2 send, (4) retire key1.

## Interview takeaway

“Key rotation outages come from send advancing before all peers accept—overlap accept lifetimes and stage send.”

## Prevention checklist

- [ ] NTP stratum healthy
- [ ] Key2 accept already active ≥ 24h
- [ ] Send cutover in waves (spokes, then hubs)
- [ ] Neighbor count monitored per wave

## Related

- [MD5 Authentication and Key Chains](../16_Authentication_and_Security/02_MD5_Authentication_and_Key_Chains.md)
- [Operational Auth Failures](../16_Authentication_and_Security/06_Operational_Auth_Failures.md)

---
