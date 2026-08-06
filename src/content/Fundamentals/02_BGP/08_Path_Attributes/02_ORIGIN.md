# ORIGIN

ORIGIN records how the prefix entered the original BGP speaker:

- **IGP (i):** introduced with a BGP network-style mechanism.
- **EGP (e):** learned through the obsolete Exterior Gateway Protocol.
- **INCOMPLETE (?):** origin could not be determined, commonly redistribution.

ORIGIN is a well-known mandatory attribute. In many vendor best-path algorithms, IGP is preferred over EGP, which is preferred over INCOMPLETE. This comparison occurs after more influential policy knobs such as LOCAL_PREF and usually after AS_PATH length.

ORIGIN does **not** mean that the route is currently reachable through an IGP, nor does IGP origin make the route intrinsically trustworthy.

## Practical lesson

Changing ORIGIN to manipulate traffic is possible but weak and opaque. Prefer explicit LOCAL_PREF, communities, or a documented inbound policy.

---

