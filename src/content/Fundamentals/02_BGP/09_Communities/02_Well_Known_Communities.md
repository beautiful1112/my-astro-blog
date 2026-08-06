# Well-Known Communities

RFC-defined standard communities include:

- **NO_EXPORT:** do not advertise outside the receiving confederation.
- **NO_ADVERTISE:** do not advertise to any BGP peer.
- **NO_EXPORT_SUBCONFED:** do not advertise to external peers, including other sub-ASes in a confederation.
- **NOPEER:** do not advertise to bilateral peers; interpretation depends on the recognized well-known value and policy.

RFC 7999 defines the **BLACKHOLE** community for destination-based discard signaling, but deployments must combine it with strict prefix authorization and scope controls.

Do not infer behavior from a text label alone. Confirm the numeric value, platform support, and configured action. A community received but never matched has no operational effect.

---

