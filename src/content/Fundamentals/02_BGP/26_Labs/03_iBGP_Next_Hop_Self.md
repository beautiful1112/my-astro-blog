# Lab: iBGP and next-hop-self

## Topology

Edge R1 learns a prefix from external R2 and advertises it by iBGP to internal R3. R3 runs an IGP only to R1's loopback.

## Objectives

- Observe preserved eBGP next hop.
- Create an unresolved route on R3.
- Correct it with next-hop-self.

## Tasks

1. Establish eBGP R1–R2 and loopback iBGP R1–R3.
2. Advertise a test prefix from R2.
3. Show that R3 receives the path but cannot resolve the external next hop.
4. Apply next-hop-self on R1.
5. Re-evaluate outbound policy and verify RIB/FIB installation.

## Extension

Instead of next-hop-self, advertise the external link into the IGP and compare the resulting data path.

---

