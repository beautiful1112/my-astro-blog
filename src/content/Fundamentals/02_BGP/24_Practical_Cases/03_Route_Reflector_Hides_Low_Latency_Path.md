# Case: Route Reflector Hides the Low-Latency Path

## Symptom

A trading-site client exits through a remote edge even though a local edge has lower IGP cost and latency.

## Reasoning

The RR chose the remote path from its own topology position and advertised only that path. The client never saw the local alternative.

## Proof

The RR holds both paths; the client receives one. Simulating selection with the client's IGP cost would choose the hidden path.

## Correction

Use topology-aware RR placement, ADD-PATH, or another design that exposes the required path diversity. Validate failure-state paths too.

## Lesson

Route reflection changes visibility, so RR location can affect data-plane quality.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
