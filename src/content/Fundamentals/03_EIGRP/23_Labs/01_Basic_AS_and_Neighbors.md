# Lab: Basic AS and Neighbors

## Objective

Bring up classic EIGRP AS 100 on a three-router triangle, advertise documentation and loopback prefixes, and prove neighbor, topology, and RIB health before any DUAL or stub labs.

## Prerequisites / skills practiced

- Classic `router eigrp <as>` with `network` and `no auto-summary`
- Hello/Hold negotiation and K-value match rules
- Reading neighbor table, topology table, and `D` RIB entries (AD 90)
- Distinguishing adjacency failures (AS, K, passive) from missing prefixes

## Topology and addressing

```text
                    Lo0 203.0.113.1/32
                          R1
                         /  \
           .1 /24       /    \       .1 /24
        192.0.2.0/24 ---      --- 198.51.100.0/24
                    \            /
                     \          /
                      R2 ------ R3
                 .2        .2/.3
              Lo0 10.2.2.2/32   Lo0 10.3.3.3/32
                   link 10.0.23.0/24 (.2 = R2, .3 = R3)

R1 Gi0/0: 192.0.2.1/24     R2 Gi0/0: 192.0.2.2/24
R1 Gi0/1: 198.51.100.1/24  R3 Gi0/0: 198.51.100.3/24
R2 Gi0/1: 10.0.23.2/24     R3 Gi0/1: 10.0.23.3/24
```

Use TEST-NET / documentation ranges on the edge links; keep private `10.x` for the R2–R3 link and loopbacks so later labs can reuse the same base.

## Configuration steps

1. Address all interfaces and loopbacks; `no shut`. Verify connected reachability with ping before EIGRP.
2. On each router (classic baseline):

```text
router eigrp 100
 network 192.0.2.0 0.0.0.255
 network 198.51.100.0 0.0.0.255
 network 10.0.0.0 0.255.255.255
 no auto-summary
```

Adjust `network` wildcards so every interface and loopback is covered. Optionally set `eigrp router-id` explicitly.

3. Confirm multicast Hellos (proto 88) on shared segments. Leave K-values default (`1 0 1 0 0`) everywhere for the baseline.
4. Optionally convert **one** router to named mode later (Lab 07); keep all three classic here.
5. From R1, verify both R2 and R3 are neighbors; from each peer, confirm reciprocal adjacency and that remote loopbacks appear as successors.

## Expected show-output checkpoints

```text
show ip eigrp neighbors
show ip eigrp topology
show ip route eigrp
show ip protocols | section eigrp
show interfaces | include bandwidth|Delay
```

Look for:

- R1: **two** neighbors (192.0.2.2 and 198.51.100.3); SRTT/RTO populated; Hold countdown resets from peer Hellos (not a static local-only value).
- Topology: each remote loopback **Passive**, one successor, composite metric consistent with min-BW + cumulative delay.
- RIB: `D` routes with AD **90** (internal), next hop = successor interface IP.
- `show ip protocols`: AS 100, matching K-values, Automatic network summarization **disabled**.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| Change R2 to `router eigrp 101` | R1–R2 and R2–R3 adjacencies drop; R1–R3 may stay |
| On R3: `metric weights 0 2 0 1 0 0` (K mismatch) | Neighbors toward R3 fail; R1–R2 stays up |
| `passive-interface GigabitEthernet0/0` on R1 toward R2 | Lose that neighbor; prefix may still be advertised if `network` covers the subnet |
| ACL deny proto 88 in one direction | One-way Hellos → adjacency never forms or flaps |

## Verification checklist

- [ ] Bidirectional pings on all three links before and after EIGRP
- [ ] Three loopbacks reachable from every router via EIGRP
- [ ] No Active prefixes in steady state
- [ ] Documented Hold time learned from neighbor

## Write-up / interview reflection

1. Which neighbor-table field proves Hold is **learned from the peer**?
2. Why does K-value mismatch kill adjacency instead of installing bad metrics?
3. What exact `show` proves a prefix is EIGRP-**internal** vs missing/external?
4. If an interface is passive but covered by `network`, what still happens to the prefix?

## Related

- [AS number in EIGRP](../03_Process_and_Address_Families/01_AS_Number_in_EIGRP.md)
- [Neighbor formation requirements](../05_Neighbor_Discovery/01_Neighbor_Formation_Requirements.md)
- [Hello interval and Hold](../05_Neighbor_Discovery/02_Hello_Interval_and_Hold_Time.md)
- [Common neighbor mismatches](../05_Neighbor_Discovery/07_Common_Neighbor_Mismatches.md)

---
