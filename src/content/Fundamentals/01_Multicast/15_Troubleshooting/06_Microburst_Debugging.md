# Debugging multicast microbursts

Correlate:

- exchange/application sequences;
- ingress and egress hardware timestamps;
- switch queue watermarks and drops;
- NIC missed/no-buffer/descriptor counters;
- kernel UDP and socket drops;
- application scheduling pauses, page faults, and GC;
- A/B gaps: one-line loss suggests a path issue, while identical loss on both suggests shared infrastructure.

Minute averages hide sub-millisecond congestion. Use watermark or event telemetry at sufficient resolution.

