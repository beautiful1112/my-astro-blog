# Data-plane asymmetry

Control plane looks perfect (symmetric successors) but applications fail one way, or return path differs enough to break stateful firewalls/uRPF.

## Patterns

| Pattern | Mechanism |
|---|---|
| Different exit metrics per direction | Unequal delay/BW on sides |
| Hub hairpin one way, shortcut NHRP other | DMVPN Phase asymmetry |
| RIB winner ≠ CEF path set | Stale CEF / multiple paths |
| uRPF strict | Reverse path not via ingress iface |
| Null0 summary on one border only | One direction blackholes |

## Evidence

```text
traceroute <dst>  ! from both ends
show ip route <dst>
show ip cef <dst> detail
show ip nhrp
show ip interface | include policy|uRPF
```

Prove forward and reverse hops independently.

## Remediation

1. Align metrics for symmetry where stateful middleboxes require it.
2. Prefer designs that accept asymmetry only with stateful firewalls that support it.
3. Fix Null0/summary consistency on both borders.
4. For DMVPN, confirm NHRP mappings both directions.

## Interview framing

“EIGRP RIB symmetry does not guarantee application success—traceroute both ways and check uRPF, firewalls, and Null0.”

## Firewall state

Asymmetric return through a stateful firewall drops sessions even when both paths have perfect EIGRP routes. Align exit points or enable asymmetric-aware firewall features deliberately.

## Null0 one-sided summary

If only BR1 summarizes and BR2 does not, traffic toward a hole may Null0 on BR1 while the reverse path via BR2 succeeds—classic “one-way” ticket. Keep summary policy identical on redundant borders.

## Verification pair

```text
traceroute x.x.x.x source <lan-a>
! on far end:
traceroute <lan-a-host> source <lan-b>
```

Save both outputs in the ticket before changing metrics.

## Related

- [Troubleshooting Framework](01_Troubleshooting_Framework.md)
- [Summary Blackhole No Null0](../21_Practical_Cases/04_Summary_Blackhole_No_Null0.md)
- [DMVPN and Tunnel Notes](../17_WAN_NBMA_and_Tunnels/05_DMVPN_and_Tunnel_Notes.md)

---
