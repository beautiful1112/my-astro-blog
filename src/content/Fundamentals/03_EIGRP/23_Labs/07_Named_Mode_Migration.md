# Lab: Named Mode Migration

## Objective

Migrate one classic EIGRP speaker to **named mode** while keeping the same autonomous-system number on the wire, and verify neighbors and topology parity with remaining classic peers.

## Prerequisites / skills practiced

- Mapping classic knobs → named AF / af-interface / topology base
- Same AS requirement for adjacency with classic neighbors
- Staged cutover without leaving conflicting dual processes
- Verifying `show run` structure and `show ip protocols`

## Topology and addressing

```text
R1 (classic AS 100) ---- R2 (migrate → named) ---- R3 (classic AS 100)

R1–R2: 192.0.2.0/24     (.1=R1, .2=R2)
R2–R3: 198.51.100.0/24  (.2=R2, .3=R3)
R1 Lo0: 10.1.1.1/32
R2 Lo0: 10.2.2.2/32
R3 Lo0: 10.3.3.3/32
Optional R1–R3: 203.0.113.0/24 if you want a triangle during cutover
```

Start with all three classic (Lab 01 style). Only R2 changes process style.

## Configuration steps

1. On R2, document classic config before change: AS, `network`, passive-interfaces, K-values, stub, auth, summaries, redistribute.
2. Build named equivalent **before** removing classic (maintenance window). Example:

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  network 192.0.2.0 0.0.0.255
  network 198.51.100.0 0.0.0.255
  network 10.2.2.2 0.0.0.0
  topology base
   exit-af-topology
  af-interface GigabitEthernet0/0
   ! match classic hello/hold if non-default
  exit-af-interface
  af-interface GigabitEthernet0/1
  exit-af-interface
 exit-address-family
```

3. Cut over carefully: remove `router eigrp 100` classic **after** named AF is complete, or follow platform migration guidance so both do not fight on the same interfaces.
4. Immediately verify R1 and R3 re-form or retain neighbors with R2.
5. Diff topology and RIB for loopbacks across all three routers—metrics should match pre-migration intent.
6. Optional: move one classic hello timer into `af-interface` and confirm peer Hold updates.

## Expected show-output checkpoints

```text
show ip eigrp neighbors
show run | section router eigrp
show ip protocols
show ip eigrp topology
show ip route eigrp
```

Look for:

- Neighbors up to both classic peers; same AS 100 in protocols output
- Named process name (`CAMPUS`) in running-config with `autonomous-system 100` under AF
- No unexpected Active; loopbacks still `D` AD 90
- Wire behavior unchanged: IP proto 88, multicast 224.0.0.10 (IPv4)

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| Wrong AS inside AF (e.g. 101) | Adjacency fails with classic AS 100 peers |
| Forgot af-interface hello match | Hold/Hello mismatch flaps |
| Left classic + named both active poorly | Flaps, duplicate hellos, or platform-dependent conflict—avoid |
| Stub/auth only on classic leftover | Partial feature loss after cutover |

## Verification checklist

- [ ] Pre-migration classic feature list captured
- [ ] Post-migration neighbor table matches expected peers
- [ ] Topology metrics for test prefixes unchanged in intent
- [ ] Running-config shows only named process on R2

## Write-up / interview reflection

1. Diff classic vs named for **your** exact features (timers, stub, summary, auth).
2. Did the on-the-wire protocol change (proto 88 / multicast)?
3. What broke first when AS mismatched inside the AF?
4. Where do interface-level commands live in named mode vs classic?

## Related

- [Classic vs named mode](../03_Process_and_Address_Families/02_Classic_vs_Named_Mode.md)
- [Named mode structure](../13_Named_Mode_and_Configuration/01_Named_Mode_Structure.md)
- [AF interface configuration](../13_Named_Mode_and_Configuration/03_AF_Interface_Configuration.md)
- [Migrating classic to named](../13_Named_Mode_and_Configuration/05_Migrating_Classic_to_Named.md)

---
