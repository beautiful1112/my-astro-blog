# Case 14: MVR leaks a feed into an unauthorized receiver VLAN

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Symptom

A host in receiver VLAN 103 captures market-data group `239.10.10.10` even though only VLANs 101 and 102 are authorized. No routed multicast boundary appears to be crossed.

## Cause

MVR maps the group range from multicast VLAN 900 into several receiver VLANs. A broad group range, static receiver port, stale MLAG synchronization, or MAC-only alias entry adds the VLAN 103 port to the replication list.

Because MVR performs controlled Layer-2 cross-VLAN replication, checking PIM routes and router ACLs does not reveal the leak.

## Investigation

1. identify source VLAN, MVR group mapping, and all receiver VLAN roles;
2. inspect logical MVR membership by port and timer;
3. distinguish dynamic Report, static configuration, and peer-synchronized reasons;
4. compare IP group entry with destination-MAC replication entry;
5. check whether another aliased IPv4 group legitimately joined the same MAC;
6. inspect hardware replication list, not only software membership;
7. capture VLAN tags at ingress and unauthorized egress.

## Fix

- narrow the MVR group range;
- remove unintended static membership;
- apply per-port/per-VLAN group and source policy;
- use IP-based multicast lookup where alias isolation is required;
- clear/reprogram stale MLAG state using the platform's safe procedure;
- enforce source admission in multicast VLAN 900.

## Validation

Test allowed and denied groups from authorized and spoofed sources. Confirm no copy reaches VLAN 103 during normal operation, receiver leave, peer failover, or unknown-group state.

## Lesson

MVR is a policy-bearing forwarding mechanism. Treat its cross-VLAN mappings like routed multicast boundaries and audit the programmed replication list.
