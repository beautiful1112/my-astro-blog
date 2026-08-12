# OSPF to IS-IS migration

Treat this as a **brownfield program**, not a weekend cutover.

## High-level sequence

1. **HLD:** why migrate (scale, SR, dual-stack, staff). If the answer is “blog said so,” stop.
2. **Address and loopback plan** that both IGPs can use.
3. **Ships in the night:** run IS-IS in parallel, prefer OSPF until parity.
4. **Move traffic** by metric/admin distance/policy in slices (core first or region first—pick one story).
5. **Remove OSPF** only when assurance says IS-IS carries production and ops is trained.
6. **Redistribute only as a temporary seam**, tagged, at controlled borders.

Never mutual-redistribute everywhere “so nothing breaks.” That is how both domains break.

## Interview framing

“Migration is parallel run, sliced cutover, and a temporary tagged seam—not a dual-redistribute mesh and a prayer.”

---
