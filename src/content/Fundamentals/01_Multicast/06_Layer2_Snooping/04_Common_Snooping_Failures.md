# Common Layer-2 multicast failures

1. No querier: membership state ages out.
2. Mrouter port not learned: reports/data do not cross the uplink.
3. Fast leave on a shared port: one listener removes all listeners behind it.
4. Unknown-multicast drop: data arrives before membership state or reports were filtered.
5. MAC aliasing: unrelated IPv4 groups share one multicast MAC.
6. TCAM/replication exhaustion: software forwarding, flooding, admission failure, or drops.
7. STP/MLAG topology change: snooping or replication state becomes stale.
8. VLAN mismatch: listener report and feed data live in different VLANs.
9. IPv4-only filtering suppresses required IPv6 multicast.

