# Capacity and Failure Domains

For every primary and backup path, record:

- Carrier and circuit ID.
- Physical building entry and meet-me room.
- Cross-connect and patch panel.
- Exchange fabric.
- Router, line card, optic, and power feed.
- Upstream ASN and shared provider backbone.
- Expected traffic after failure.

BGP can select a backup that lacks capacity or shares the same cut fiber. Model N-1 and relevant N-2 failures, then verify that LOCAL_PREF and advertisements lead traffic to an adequately sized path.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
