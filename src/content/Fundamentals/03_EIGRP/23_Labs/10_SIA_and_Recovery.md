# Lab: SIA and Recovery

## Objective

Induce Active / Stuck-in-Active **pressure** with a wide query domain (no stubs, delayed Reply), then remediate with **stub + summarization**, and contrast recovery versus “fix neighbors” as a false fix.

## Prerequisites / skills practiced

- Active vs SIA timers and SIA-Query/SIA-Reply role
- Query domain size as an operational risk
- Stub and summary as design controls (Labs 04–05)
- Event-log reading without reckless blanket debug

## Topology and addressing

```text
Spoke-A (non-stub) ─┐
Spoke-B (non-stub) ─┼── Hub/Agg ─── WAN ─── Remote
Spoke-C (non-stub) ─┘      |                Lo0 10.9.9.9/32
Spoke-D (non-stub) ─┘   10.0.0.0/24
                           Core optional

Hub–Spoke-A: 192.0.2.0/24      (.1=Hub, .2=A)
Hub–Spoke-B: 198.51.100.0/24   (.1=Hub, .2=B)
Hub–Spoke-C: 203.0.113.0/24    (.1=Hub, .2=C)
Hub–Spoke-D: 10.0.14.0/24      (.1=Hub, .4=D)
Hub–Remote:  10.0.0.0/24       (.1=Hub, .9=Remote)
Remote Lo0:  10.9.9.9/32
Spoke loopbacks: 10.1.1.1/32 … 10.4.4.4/32
```

Lab simplification: four non-stub spokes + Hub + Remote is enough. Delay Reply on one spoke with a temporary ACL.

## Configuration steps

1. EIGRP AS 100 on all routers; **no** `eigrp stub`; advertise Remote Lo0 and spoke loopbacks; `no auto-summary`.
2. Confirm every spoke learns `10.9.9.9/32` via Hub and Hub has many neighbors.
3. Optional delay: on Spoke-D (or Hub interface to D), briefly filter EIGRP toward D so Query is sent but Reply is late:

```text
! Example — use carefully and remove promptly
access-list 101 deny eigrp any any
access-list 101 permit ip any any
interface GigabitEthernet0/0
 ip access-group 101 in
```

Prefer short windows; do not leave ACLs in place.

4. Withdraw Remote Lo0 (`shutdown`) or shut Hub–Remote. Watch Hub and spokes:

```text
show ip eigrp topology active
show ip eigrp events
show ip eigrp neighbors detail
```

5. If Active persists toward SIA, note which neighbor is outstanding; remove ACL; observe SIA-Query/Reply or neighbor reset behavior per platform.
6. **Remediation**: configure `eigrp stub connected summary` on all spokes; add interface summary at Hub toward Remote/WAN if applicable; restore Remote; clear any stuck state **after** design fix.
7. Retract Remote again: Queries should **not** fan out to stubs; Active scope shrinks dramatically.

## Expected show-output checkpoints

| Phase | Expected |
|-------|----------|
| No stub, withdraw Remote | Wide Active; Queries toward many spokes |
| Delayed Reply | Prolonged Active; possible SIA / neighbor drop for laggard |
| After stub + summary | Spokes not Queried; Active rare/local; faster Passive |
| Bad “fix” during Active | Extra adjacency loss—symptom relief only |

`neighbors detail` after remediation: stub flags set. Event history shows fewer Query destinations.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| `clear ip eigrp neighbors` mid-Active as “fix” | Disruption; problem returns on next failure |
| Stub only on half the spokes | Remaining non-stubs still expand query domain |
| Summary without Null0 awareness | Separate blackhole risk (Lab 05) |
| Permanent ACL “to stabilize” | Guaranteed SIA / partition |

## Verification checklist

- [ ] Pre-fix: Active with many pending Replies; delayed neighbor identified
- [ ] Stub flags on all spokes after remediation
- [ ] Second withdrawal: Query fanout reduced
- [ ] Runbook note: design first, clear last

## Write-up / interview reflection

1. Which neighbor delayed Reply, and how did you see it?
2. Did stub eliminate Queries to spokes on the second failure?
3. What should you **not** debug or clear first during Active/SIA?
4. How do summarization and stub complement each other for query-domain design?

## Related

- [Stuck in Active](../08_DUAL_and_Feasibility/08_Stuck_in_Active.md)
- [SIA Query and SIA Reply](../04_Packets_and_Transport/07_SIA_Query_and_SIA_Reply.md)
- [Query propagation](../09_Query_Scope_and_Convergence/01_Query_Propagation.md)
- [Designing the query domain](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)
- [Stub as query boundary](../09_Query_Scope_and_Convergence/03_Stub_as_Query_Boundary.md)

---
