# BGP Confederations

RFC 5065 divides one public AS into multiple internal member ASes. Between member ASes, sessions have eBGP-like behavior while confederation-specific AS_PATH segments prevent internal loops.

At the external boundary, the confederation appears as one AS and internal member-AS details are normally removed.

Advantages:

- Reduces a large iBGP full mesh.
- Allows policy and administration between sub-ASes.

Costs:

- More complex AS-path interpretation and policy.
- Migration and troubleshooting overhead.
- Less common operational familiarity than route reflection.

Confederations and route reflection can be combined, but most designs should use the simplest scaling mechanism that meets their requirements.

---

