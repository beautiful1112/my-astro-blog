# Case 11: Unicast works while MBGP multicast RPF fails

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Topology and symptom

Unicast traffic reaches source `192.0.2.10` through Transit-A. Multicast is engineered through Transit-M using IPv4 multicast SAFI. Ping and TCP recovery sessions work, but the receiver gets no `(192.0.2.10,232.10.10.10)` data after a routing change.

```text
unicast RIB: 192.0.2.0/24 -> Transit-A
MBGP SAFI 2: 192.0.2.0/24 -> Transit-M (withdrawn/missing)
data still arrives from Transit-M
```

## Failure mechanism

The SAFI-2 route is withdrawn or rejected. The router either has no multicast RPF route or falls back to the unicast route through Transit-A. PIM Join moves to Transit-A while the provider continues delivering data on Transit-M. Packets on Transit-M fail RPF.

## Evidence

- BGP TCP session remains established;
- unicast SAFI contains `192.0.2.0/24`;
- multicast SAFI route is absent or has a different next hop;
- `show rpf 192.0.2.10` points at Transit-A or reports no neighbor;
- `(S,G)` Join leaves Transit-A;
- data capture and RPF-drop counter rise on Transit-M.

## Investigation

1. confirm both peers negotiated multicast AFI/SAFI;
2. inspect received, accepted, and best multicast NLRI;
3. check per-family policy and maximum-prefix state;
4. inspect BGP next-hop resolution and MRIB installation;
5. compare the actual data ingress with selected RPF IIF;
6. confirm PIM adjacency exists on the selected replacement path.

## Fix and validation

Restore the intended source-prefix advertisement/policy or align provider data delivery with the new RPF path. Do not add a static mroute until the control-plane ownership is clear.

Withdraw and restore the SAFI-2 prefix in a controlled test. Measure BGP, MRIB, PIM Join, MFIB, and packet-sequence convergence separately.

## Lesson

A working unicast path proves application reachability, not multicast topology. Always compare SAFI 1, SAFI 2, MRIB, PIM Join direction, and actual data ingress.
