# Lab: Authentication Key Chain

## Objective

Enable MD5 key-chain authentication on classic EIGRP and perform an **overlap-friendly key rollover** without adjacency loss; optionally note named-mode HMAC-SHA if the image supports it.

## Prerequisites / skills practiced

- Key-chain send vs accept lifetimes
- Interface `ip authentication mode eigrp` + key-chain
- Distinguishing auth failure from K-mismatch / AS mismatch
- Safe rollover: accept both → switch send → remove old

## Topology and addressing

```text
R1 ---------------- R2 ---------------- R3
192.0.2.1/24    192.0.2.0/24      198.51.100.0/24
                .2           .2/.3

R2 Gi0/0: 192.0.2.2/24   R2 Gi0/1: 198.51.100.2/24
R3 Gi0/0: 198.51.100.3/24
Lo0: R1 10.1.1.1/32, R2 10.2.2.2/32, R3 10.3.3.3/32
```

Authenticate both links (or start with R1–R2, then extend).

## Configuration steps

1. Baseline: EIGRP AS 100 neighbors up **without** auth; save `show ip eigrp neighbors`.
2. Matching key-chains on all routers:

```text
key chain EIGRP-KEYS
 key 1
  key-string SECRET1
  accept-lifetime local 00:00:00 Jan 1 2020 infinite
  send-lifetime local 00:00:00 Jan 1 2020 infinite
```

3. Apply on interfaces (classic); named uses `af-interface` `authentication mode md5` + `authentication key-chain`:

```text
interface GigabitEthernet0/0
 ip authentication mode eigrp 100 md5
 ip authentication key-chain eigrp 100 EIGRP-KEYS
```

4. Verify adjacency stable with auth after any brief mismatch during config.
5. **Rollover**: add key 2 with overlapping **accept-lifetime**; switch **send-lifetime** to key 2 on both ends; remove key 1 only after both send key 2.

```text
key 2
 key-string SECRET2
 accept-lifetime local 00:00:00 Aug 10 2026 infinite
 send-lifetime local 12:00:00 Aug 10 2026 infinite
```

## Expected show-output checkpoints

```text
show ip eigrp neighbors
show key chain
show ip eigrp interfaces detail
```

Look for: neighbors up with auth; key chain shows sending vs acceptable keys; wrong key-string → adjacency down (Hellos ignored); rollover with continuous uptime if accept lifetimes overlap.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| Non-overlapping send/accept lifetimes | Neighbor down at cutover |
| Wrong key-string / auth one side only | Adjacency fails |
| Confuse with K mismatch | Both kill adjacency—compare `show ip protocols` K vs key chain |

## Verification checklist

- [ ] Baseline neighbors without auth documented
- [ ] Auth enabled; neighbors stable
- [ ] Rollover accept vs send timeline written down
- [ ] Negative test: wrong key → down; fix → up

## Write-up / interview reflection

1. What accept vs send lifetime timeline gave zero-downtime rollover?
2. How do auth-failure symptoms differ from K-value mismatch?
3. Why must accept-lifetime overlap during rollover?
4. Bonus: named-mode HMAC-SHA vs classic MD5?

## Related

- [Why authenticate EIGRP](../16_Authentication_and_Security/01_Why_Authenticate_EIGRP.md)
- [MD5 authentication and key chains](../16_Authentication_and_Security/02_MD5_Authentication_and_Key_Chains.md)
- [HMAC-SHA named mode](../16_Authentication_and_Security/03_HMAC_SHA_Named_Mode.md)
- [Operational auth failures](../16_Authentication_and_Security/06_Operational_Auth_Failures.md)
- [Case: auth key rollover outage](../21_Practical_Cases/07_Auth_Key_Rollover_Outage.md)

---
