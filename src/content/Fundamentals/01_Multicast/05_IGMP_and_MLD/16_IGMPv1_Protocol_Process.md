# IGMPv1 join, refresh, and leave process

## Join

When a host first joins G on an interface:

1. It sends an unsolicited v1 Report immediately to G.
2. It starts a random delay timer and repeats the report once or twice to tolerate loss.
3. The router creates/refreshed group-present state for G on that link.

## Periodic refresh

1. A multicast router sends a General Query to 224.0.0.1.
2. Each member starts a random 0–10 second timer for each joined group.
3. The first host whose timer expires reports G to G.
4. Other members hear that report and cancel their timers for G.
5. The router refreshes G's membership timer.

## Leave

IGMPv1 sends no leave message:

1. The application leaves.
2. The host silently deletes its membership when the last local socket leaves.
3. If no other host reports G, router state eventually expires.

This makes leave latency roughly a membership-aging problem, not a fast verification process.

~~~mermaid
sequenceDiagram
    participant H1 as "Host 1"
    participant H2 as "Host 2"
    participant R as "Router"
    R->>H1: "General Query to 224.0.0.1"
    R->>H2: "General Query to 224.0.0.1"
    Note over H1,H2: "Each starts random timer for G"
    H1->>R: "v1 Report for G"
    H1-->>H2: "Report is also heard on the LAN"
    Note over H2: "Cancel timer: report suppression"
    Note over R: "Refresh group G timer"
~~~

## Operational consequence

A packet capture may show only one report for a group even when many v1 hosts are listening. The router tracks link-level presence, not a complete host list.

Primary reference: [RFC 1112, Appendix I](https://www.rfc-editor.org/rfc/rfc1112.html).

