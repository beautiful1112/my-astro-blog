# Path Diversity and Fast Reroute

Fast recovery needs both early failure detection and a usable alternate path. Diversity can be lost when:

- A route reflector advertises only one path.
- Policy rejects the backup.
- Both “different” peers share the same circuit or failure domain.
- The backup next hop depends on the failed underlay.

ADD-PATH, diverse RRs, multipath, and preinstalled backups can improve control-plane diversity. Physical route, power, carrier, exchange fabric, and line-card diversity must also be verified.

For a quantitative trading site, label each route and circuit by failure domain; two BGP sessions are not automatically redundant.

---

