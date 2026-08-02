# IGMPv3 source-filter protocol process

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

IGMPv3 has two reporting paths:

- **State-Change Reports** are triggered by a local interface-state change.
- **Current-State Reports** answer Queries and refresh soft state.

## SSM join example

An application requests INCLUDE {S1} for G:

1. Kernel merges all sockets and changes interface state from INCLUDE {} to INCLUDE {S1}.
2. Host sends a v3 Report to 224.0.0.22 containing ALLOW_NEW_SOURCES {S1}.
3. It retransmits state-change information according to the Robustness Variable.
4. Router adds/refreshes source S1 for group G on the link.
5. Multicast routing can create upstream (S1,G) state.

## Source leave example

Interface state changes from INCLUDE {S1} to INCLUDE {}:

1. Host reports BLOCK_OLD_SOURCES {S1}.
2. Querier lowers S1's timer.
3. Querier sends Group-and-Source-Specific Queries for G, S1.
4. If no other listener reports S1, the router removes source interest.

## Periodic refresh

1. Querier sends General Query with QRV and QQIC.
2. Each host schedules a response within Max Resp Time.
3. Host sends MODE_IS_INCLUDE or MODE_IS_EXCLUDE records for current interface state.
4. Router refreshes group/source timers.

~~~mermaid
sequenceDiagram
    participant A as "Application"
    participant K as "Host kernel"
    participant R as "IGMPv3 querier"
    participant P as "PIM / multicast routing"
    A->>K: "Listen to (S1,G)"
    K->>R: "ALLOW_NEW_SOURCES {S1} for G"
    R->>P: "Listener interest for (S1,G)"
    A->>K: "Stop listening to (S1,G)"
    K->>R: "BLOCK_OLD_SOURCES {S1}"
    R->>K: "Group-and-Source Query (G,S1)"
    alt "No other listener responds"
        R->>P: "Remove (S1,G) link interest"
    else "Another listener responds"
        K->>R: "MODE_IS_INCLUDE {S1}"
        Note over R: "Retain source state"
    end
~~~

## ASM join representation

A traditional join of G from any source is represented as **EXCLUDE {}**. Moving from conceptual no-state INCLUDE {} to EXCLUDE {} produces CHANGE_TO_EXCLUDE_MODE {}.

Primary reference: [RFC 3376, Sections 5–6](https://www.rfc-editor.org/rfc/rfc3376.html#section-5).

