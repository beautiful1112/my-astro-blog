# Lab: Stub Query Bounding

## Objective

Prove that hubs **do not Query** EIGRP stub spokes for lost prefixes, then remove stub and show Queries reaching the spoke—linking stub design to SIA risk reduction.

## Prerequisites / skills practiced

- `eigrp stub` options (connected, summary, static, redistributed, receive-only)
- Hub-and-spoke query boundary behavior
- Neighbor detail stub flags
- Separating “stub” (control plane) from “no IP transit” (forwarding)

## Topology and addressing

```text
  Spoke-A (stub) ---- Hub ---- Spoke-B (stub)
  192.0.2.2/24         .1        198.51.100.3/24
       |                |
       |           10.0.0.1/24
       |                |
      LoA              Core
   10.1.1.1/32      10.0.0.2/24
                    LoC 203.0.113.1/32

Spoke-B Lo0: 10.2.2.2/32   (prefix under test)

Hub Gi0/0: 192.0.2.1/24   — Spoke-A Gi0/0: 192.0.2.2/24
Hub Gi0/1: 198.51.100.1/24 — Spoke-B Gi0/0: 198.51.100.3/24
Hub Gi0/2: 10.0.0.1/24     — Core Gi0/0: 10.0.0.2/24
```

AS 100 everywhere. Spokes are single-homed to Hub; Core is a non-stub neighbor.

## Configuration steps

1. Base EIGRP on Hub, Spoke-A, Spoke-B, Core; advertise all links and loopbacks; `no auto-summary`.
2. On both spokes (classic):

```text
router eigrp 100
 eigrp stub connected summary
```

Named equivalent under AF topology base: `eigrp stub connected summary`.

3. Verify Hub learns `10.2.2.2/32` from Spoke-B and advertises it to Spoke-A and Core.
4. On Spoke-A, prepare to watch Queries (event log or brief `debug eigrp packets query` **only** on A).
5. Withdraw Spoke-B’s loopback: `interface Loopback0` → `shutdown` (or remove `network`).
6. Observe: Hub goes Active for the prefix toward Core as needed; **Spoke-A should not receive Queries** for that destination while stub is set.
7. Remove stub on Spoke-A (`no eigrp stub`); restore Spoke-B Lo0; wait Passive; withdraw Lo0 again. Confirm Query **arrives** at Spoke-A.

## Expected show-output checkpoints

```text
show ip eigrp neighbors detail
show ip eigrp topology 10.2.2.2/32
show ip eigrp topology active
show ip route 10.2.2.2
```

Look for:

- Neighbor detail on Hub: spoke peers flagged as stub; Hub suppresses Queries to them.
- With stub: Spoke-A stays Quiet for B’s prefix loss (no Query); may still have had the route via Hub before withdrawal.
- Without stub: Query visible on Spoke-A; Active may appear briefly if A has no FS.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| `eigrp stub receive-only` on Spoke-B | Hub never learns Spoke-B connected prefixes |
| Stub on Hub by mistake | Hub stops advertising/querying as designed for a leaf—breaks design |
| Spoke dual-homed without leak/summary plan | Stub + dual-homing surprises (document; advanced) |
| Expect “no transit” solely from stub | Packets still forward if RIB has routes |

## Verification checklist

- [ ] Stub flags confirmed in `neighbors detail`
- [ ] Side-by-side: Query absent (stub) vs present (no stub) on Spoke-A
- [ ] Core still participates in Query when appropriate
- [ ] Notes on which stub options were advertised from spokes

## Write-up / interview reflection

1. Which stub options did spokes advertise, and what did Hub install?
2. Did stub stop spokes from **receiving** Core’s `203.0.113.1/32`?
3. How does stub bounding reduce SIA exposure compared to Lab 03/10?
4. Why is “stub = no transit” an incomplete operational statement?

## Related

- [EIGRP stub overview](../11_Stub_Filtering_and_Split_Horizon/01_EIGRP_Stub_Overview.md)
- [Stub options](../11_Stub_Filtering_and_Split_Horizon/02_Stub_Options.md)
- [Stub in hub and spoke](../11_Stub_Filtering_and_Split_Horizon/03_Stub_in_Hub_and_Spoke.md)
- [Stub as query boundary](../09_Query_Scope_and_Convergence/03_Stub_as_Query_Boundary.md)
- [Designing the query domain](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)

---
