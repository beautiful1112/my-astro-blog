# MD5 authentication and key chains

Classic EIGRP authentication uses **MD5** digests driven by a **key chain**. Each key has an ID, key-string, and optional send/accept lifetimes for rollover.

## Key chain structure

```text
key chain EIGRP-KEYS
 key 1
  key-string SuperSecret1
  accept-lifetime 00:00:00 Jan 1 2024 23:59:59 Dec 31 2026
  send-lifetime 00:00:00 Jan 1 2024 23:59:59 Jun 30 2026
 key 2
  key-string SuperSecret2
  accept-lifetime 00:00:00 Jan 1 2026 infinite
  send-lifetime 00:00:00 Jul 1 2026 infinite
```

Rules of thumb:

- Overlap **accept** windows so both old and new keys validate during migration.
- Advance **send** on one side only after all peers accept the new key.
- Key ID must match for the digest in use; mismatched IDs look like auth failure.

## Classic mode interface config

```text
interface GigabitEthernet0/0
 ip authentication mode eigrp 100 md5
 ip authentication key-chain eigrp 100 EIGRP-KEYS
```

AS number in the interface commands must match the EIGRP process.

## Named mode (MD5)

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface GigabitEthernet0/0
   authentication mode md5
   authentication key-chain EIGRP-KEYS
  exit-af-interface
```

## Rollover procedure (zero-ish downtime)

1. Add key 2 with accept-lifetime already valid on **all** routers.
2. Verify clocks (NTP)—lifetime is wall-clock based.
3. Enable send-lifetime for key 2 on all routers (or staged groups).
4. Retire key 1 accept after send has moved everywhere.
5. Remove key 1.

Skipping overlap causes a neighbor outage ([Auth Key Rollover Outage](../21_Practical_Cases/07_Auth_Key_Rollover_Outage.md)).

## Verification

```text
show ip eigrp interfaces detail
show key chain EIGRP-KEYS
show ip eigrp neighbors
! missing neighbors + auth config = suspect mismatch
```

Syslog often reports authentication failure when digests disagree.

## Risks

- Non-NTP clocks → unexpected lifetime expiry.
- Same key-string, different key IDs.
- Typing key-string with accidental space/quotes differences across devices.

## Interview framing

“MD5 EIGRP auth uses key chains; rotate with overlapping accept lifetimes and coordinated send activation so neighbors never lose a mutually valid key.”

## Related

- [HMAC-SHA Named Mode](03_HMAC_SHA_Named_Mode.md)
- [Operational Auth Failures](06_Operational_Auth_Failures.md)
- [Auth Key Rollover Outage](../21_Practical_Cases/07_Auth_Key_Rollover_Outage.md)

---
