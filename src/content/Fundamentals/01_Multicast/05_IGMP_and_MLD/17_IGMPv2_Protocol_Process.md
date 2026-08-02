# IGMPv2 join, query, and leave process

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Join and refresh

The join/periodic process resembles v1:

1. Host immediately sends a v2 Report to G and repeats it after a short random delay.
2. The querier periodically sends a General Query to 224.0.0.1 with Group Address 0.0.0.0.
3. Every host schedules one response timer for each joined group on that interface.
4. When a timer for G expires, the host sends a type-0x16 Report to destination G, with G also in the IGMP Group Address field.
5. A host that hears another v1/v2 Report for G before its timer expires cancels its own report for G.
6. The router refreshes its link-level group timer from whichever valid Report arrives.

The host also tracks whether it was the **last reporter** heard for G.

~~~mermaid
sequenceDiagram
    participant R as "IGMPv2 querier"
    participant A as "Host A: G1 and G2"
    participant B as "Host B: G1"
    R->>A: "General Query to 224.0.0.1"
    R->>B: "General Query to 224.0.0.1"
    Note over A: "Start independent timers for G1 and G2"
    Note over B: "Start timer for G1"
    A->>R: "0x16 Report to G1"
    A-->>B: "G1 Report heard on the LAN"
    Note over B: "Cancel pending G1 Report"
    A->>R: "Separate 0x16 Report to G2"
    Note over R: "Refresh G1 and G2 link state"
~~~

The General Query and its responses therefore use different destinations:

- Query: 224.0.0.1, because every multicast-capable host must receive it.
- Response: the reported group G, because the response refreshes G and enables other G members to suppress duplicates.
- Never the querier's unicast IP address.

## Leave and last-member verification

When the last local socket leaves G:

1. If the host believes it was the last reporter, it sends Leave Group to 224.0.0.2.
2. The querier sends LMQC Group-Specific Queries to G, spaced by LMQI.
3. Remaining listeners respond with a v1/v2 Report.
4. Any response preserves forwarding.
5. No response by the end of LMQT lets the router remove G.

With defaults, LMQI = 1 second and LMQC = 2, so verification is about 2 seconds.

~~~mermaid
sequenceDiagram
    participant L as "Leaving host"
    participant R as "IGMP querier"
    participant H as "Possible remaining host"
    L->>R: "Leave 0x17 for G, destination 224.0.0.2"
    R->>H: "Group-Specific Query for G"
    R->>H: "Group-Specific Query for G"
    alt "Another listener exists"
        H->>R: "Membership Report for G"
        Note over R: "Keep forwarding G"
    else "No listener answers"
        Note over R: "Expire G after last-member query time"
    end
~~~

## Why the Leave is not an immediate prune

The leaving host knows only its own socket state. Its “last reporter” flag does not prove no silent/suppressed receiver remains. The router must query the link before removing shared forwarding state.

Primary reference: [RFC 2236, Section 3](https://www.rfc-editor.org/rfc/rfc2236.html#section-3).
