# Lab: Successor and Feasible Successor

## Objective

Build a metric-tuned triangle so R1 has a **successor** and a **feasible successor** to R3’s loopback; prove local repair stays Passive (no Query storm) when the successor link fails.

## Prerequisites / skills practiced

- Reading FD, RD, and successor vs FS flags in the topology table
- Applying the Feasibility Condition: **RD &lt; FD**
- Tuning **delay** (preferred) to create FS without breaking adjacency
- Distinguishing local repair from Active/Query diffusion

## Topology and addressing

```text
        R1 (Lo0 203.0.113.1/32)
       /  \
      /    \  delay tuned so R1→R2→R3 is successor
     /      \  and R1→R3 (direct) is FS (or reverse)
    R2------R3
         Lo0 on R3 = 10.3.3.3/32

Links (example):
  R1–R2: 192.0.2.0/24    (.1=R1, .2=R2)
  R1–R3: 198.51.100.0/24 (.1=R1, .3=R3)
  R2–R3: 10.0.23.0/24    (.2=R2, .3=R3)
```

Start from Lab 01 addressing. On the **direct** R1–R3 path, raise interface delay so the composite via R2 wins as successor while R3’s reported distance still satisfies FC.

Example (adjust until numbers work on your image):

```text
! On R1 Gi toward R3 — increase delay (tens of microseconds)
interface GigabitEthernet0/1
 delay 200
```

## Configuration steps

1. EIGRP AS 100 full triangle; advertise `10.3.3.3/32` (and other loopbacks if desired). `no auto-summary`.
2. On R1 before tuning: note equal or near-equal paths; record metrics.
3. Tune delay on one path until `show ip eigrp topology 10.3.3.3/32` shows:
   - One path marked successor (installed in RIB)
   - Second path listed as feasible successor (or “FS” in topology detail)
4. Explicitly verify FC: alternate **RD &lt; local FD**. Write the numbers in your lab notes.
5. Shut the successor interface on R1; watch topology and RIB without enabling Query debug on every device yet.
6. Restore; optionally reverse which path is successor and repeat once.

## Expected show-output checkpoints

```text
show ip eigrp topology 10.3.3.3/32
show ip eigrp topology | include 10.3.3.3|Passive|Active
show ip route 10.3.3.3
show ip eigrp topology all-links
```

Before failure:

- Prefix **Passive**; two `via` entries; outer metric of successor = FD; alternate’s **inner** metric (RD) &lt; FD.
- RIB next hop = successor only (variance still 1).

After successor shut:

- Still **Passive** (no Active)
- New successor = former FS; RIB next hop flips without waiting for full Query round-trip
- With Query logging off or scoped: little/no Query flood for this prefix when FS existed

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| Raise alternate delay until **RD ≥ FD** | FS disappears; path may remain under `all-links` only |
| Shut successor with no FS | Route goes **Active** (Lab 03) |
| Equalize metrics exactly | Two successors / ECMP — not the same as FS backup |
| Offset-list inflate RD on alternate | Lose FS while physical path still up |

## Verification checklist

- [ ] Documented FD, successor composite, alternate RD before failure
- [ ] Proof of FC inequality in lab notes
- [ ] Successor failure → Passive repair observed
- [ ] Repeat with FS destroyed → Active observed (bridge to Lab 03)

## Write-up / interview reflection

1. Quote the exact RD and FD that prove FC for your FS.
2. Did you observe Query packets when an FS existed?
3. What metric change destroyed the FS while leaving a worse path under `all-links`?
4. Why is RD == FD **not** sufficient for FS?

## Related

- [Reported distance and feasible distance](../08_DUAL_and_Feasibility/02_Reported_Distance_and_Feasible_Distance.md)
- [Feasibility condition](../08_DUAL_and_Feasibility/03_Feasibility_Condition.md)
- [Feasible successor and local repair](../08_DUAL_and_Feasibility/05_Feasible_Successor_and_Local_Repair.md)
- [Reading show eigrp topology](../06_Topology_Table_and_RIB/06_Reading_Show_EIGRP_Topology.md)

---
