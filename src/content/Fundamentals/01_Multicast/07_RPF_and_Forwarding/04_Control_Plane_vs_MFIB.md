# Multicast RIB versus forwarding hardware

The control-plane mroute contains state type, timers, flags, RPF neighbor, IIF, and OIL. The MFIB contains programmed hardware replication state.

A correct mroute with missing or stale hardware state can still drop traffic. Compare:

- software multicast routes;
- hardware replication entries/resources;
- ingress and egress packet counters;
- captures on both sides of the forwarding device.

