# AS number in EIGRP

The number in `router eigrp 100` or `autonomous-system 100` under named mode is the **EIGRP autonomous system number**: a **local process identity** that neighbors must match to form an adjacency. It is **not** an Internet public ASN in the BGP sense, does not appear in global routing registries as a BGP AS, and does not imply eBGP/iBGP relationship semantics.

## What matching means

```text
R1: router eigrp 100  --Hello AS=100-->  R2: router eigrp 100   OK
R1: router eigrp 100  --Hello AS=100-->  R2: router eigrp 200   No adjacency
```

Multiple EIGRP processes (different AS numbers) can run on one router for redistribution or migration. Same AS on both sides is required **per adjacency**, not “globally unique on the Internet.”

| Property | EIGRP AS | BGP ASN |
|---|---|---|
| Purpose | Neighbor/process match | Interdomain policy identity |
| Must be globally unique? | No (enterprise-local) | Yes for public Internet |
| Written in path vector? | No AS_PATH | Yes |
| Typical range in labs | 1–65535 (classic familiarity) | Public/private ASN rules |

Related: [Neighbor formation requirements](../05_Neighbor_Discovery/01_Neighbor_Formation_Requirements.md), [What EIGRP is](../02_Fundamentals/01_What_EIGRP_Is.md).

## Named mode placement

In named mode the AS sits under the address-family:

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
```

The process *name* (`CAMPUS`) is local configuration glue; the **autonomous-system** value is what Hellos carry for matching.

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
router eigrp 100
 network 10.1.1.0 0.0.0.255
```

### Cisco IOS / IOS XE — named

```text
router eigrp WAN
 address-family ipv4 unicast autonomous-system 100
  network 10.1.1.0 0.0.0.255
 exit-address-family
```

### Dual-process migration sketch

```text
router eigrp 100
 network 10.0.0.0 0.255.255.255
router eigrp 200
 network 10.0.0.0 0.255.255.255
! redistribute carefully between processes during migration
```

Junos/FRR: skip for production EIGRP AS labs unless your platform documents support.

## Verification

```text
show ip protocols
show ip eigrp neighbors
show eigrp protocols
```

Confirm both sides list the same AS. Mismatch often yields **empty neighbor table** with Hellos ignored—not a clear “AS mismatch” syslog on every code train.

## Risks

- Assuming EIGRP AS must equal BGP ASN at the edge.
- Running two AS processes unintentionally on one side of a link.
- Renaming named-mode process and thinking AS changed (name ≠ AS).

## Interview framing

“EIGRP’s AS number is a local adjacency and process identifier that neighbors must match—it is not an Internet BGP ASN and carries none of BGP’s path-vector meaning.”

---
