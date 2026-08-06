# BGP ADD-PATH

RFC 7911 lets a speaker advertise multiple paths for the same NLRI by adding a Path Identifier. Send and receive capability is negotiated per address family.

Benefits:

- Reduces route-reflector path hiding.
- Preserves backup paths.
- Improves convergence and multipath visibility.

Costs:

- More routes, memory, and UPDATE volume.
- Send-path selection policy becomes important.
- Path IDs identify advertisements locally; they are not globally stable path identities.

ADD-PATH does not mean “send every path.” Common modes send best plus backup, all paths, or a bounded diverse set.

---

