# Case: Graceful Restart Preserves a Blackhole

## Symptom

After an edge-router failure, its peers keep routes for several minutes while traffic is dropped.

## Reasoning

Graceful Restart told helpers to retain stale routes, but the failed router did not preserve forwarding.

## Proof

Peers mark the paths stale; the next hop is still selected; hardware and link evidence show the forwarding node is gone.

## Correction

Disable or shorten GR for this failure model, ensure alternatives are preferred, and test total node failure separately from process restart.

## Lesson

Graceful Restart assumes forwarding survives. If that premise is false, faster withdrawal is safer.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
