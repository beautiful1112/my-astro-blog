# Misconception: Stub Only Means “No Transit”

## The myth

“`eigrp stub` just means the router is not a transit router.”

## Why it is incomplete

Stub primarily changes **control plane**:

1. **Query boundary** — neighbors (hubs) do not query the stub for routes.
2. **Advertisement limits** — default connected+summary; options for static/redistributed; receive-only advertises nothing.

It does **not** by itself disable IP forwarding. A stub can still forward packets if the RIB says so. Conversely, “no transit” as a traffic-engineering goal needs addressing, filtering, or topology—not stub alone.

## Counterexample topology

```text
Spoke-A (stub) ---- Hub ---- Spoke-B
                      |
                    Core (10.0.0.0/24 LAN)
```

- Hub does **not** Query Spoke-A when Spoke-B’s prefix is lost → SIA risk drops.
- Spoke-A still **receives** Core routes and can forward packets Hub→Spoke-A→local LAN.
- If someone plugs a second uplink on Spoke-A toward Core without design, stub does not magically block transit forwarding—RIB/CEF decide.

Also wrong: “Stub routers do not receive routes.” They typically **do** receive; they limit what they **send** and Query participation.

## Ops symptom table

| Misconfig / myth | Symptom |
|------------------|---------|
| Expect stub to stop transit | Packets still flow per RIB |
| `stub receive-only` on spoke | Hub never learns spoke networks |
| Stub omitted on large spoke farm | Wide Queries / SIA under withdrawal |
| “Spoke has no routes” blamed on stub | Check filters; stub usually still receives |

## Correct habit

Configure stub for **SIA/query design** in hub-spoke; separately design whether transit is desired (topology, filtering, summaries).

## Related

- [EIGRP stub overview](../11_Stub_Filtering_and_Split_Horizon/01_EIGRP_Stub_Overview.md)
- [Stub options](../11_Stub_Filtering_and_Split_Horizon/02_Stub_Options.md)
- [Stub as query boundary](../09_Query_Scope_and_Convergence/03_Stub_as_Query_Boundary.md)
- [Lab: Stub query bounding](../23_Labs/04_Stub_Query_Bounding.md)

---
