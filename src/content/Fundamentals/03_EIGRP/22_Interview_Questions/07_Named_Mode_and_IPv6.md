# Interview: Named Mode and IPv6

## Q1 — Why named mode

**Q:** What problem does named EIGRP solve vs classic `router eigrp AS`?

**Model answer:** Named mode unifies multi-AF configuration under one process name with clear **address-family**, **af-interface**, and **topology** stanzas—cleaner IPv4/IPv6/VRF ops and feature parity (e.g., HMAC-SHA auth) without parallel classic IPv6 process quirks.

**Common wrong answer:** “Named mode is a different protocol.” Same EIGRP/DUAL; different CLI structure.

## Q2 — Classic vs named coexistence

**Q:** Can classic and named speak to each other?

**Model answer:** Yes on the wire if AS/K/AF match—named is primarily a **configuration model**. Migration is operational, not a new adjacency protocol.

**Common wrong answer:** Claiming neighbors require both sides named.

## Q3 — AF-interface

**Q:** Where do Hello, summary, auth, and split-horizon live in named mode?

**Model answer:** Under **`af-interface`** (or `af-interface default`) inside the address-family—not scattered only under global interface with classic `ip hello-interval eigrp` style (classic still uses interface commands).

**Common wrong answer:** Looking only under `router eigrp NAME` without entering AF/af-interface.

## Q4 — IPv6 RID

**Q:** Why does IPv6 EIGRP care about Router ID?

**Model answer:** EIGRP RID is **32-bit**. IPv6-only boxes may lack IPv4 interfaces to auto-pick a RID—**explicit `eigrp router-id`** is required or the process may not start/adjacencies fail.

**Common wrong answer:** Using an IPv6 address as RID.

## Q5 — Classic IPv6 gotcha

**Q:** Classic `ipv6 router eigrp` historical trap?

**Model answer:** Process often starts **shutdown** by default—must `no shutdown`. Named mode avoids some of that footgun.

**Common wrong answer:** Debugging K-values for hours while the IPv6 process is administratively down.

## Q6 — Dual-stack design

**Q:** Should IPv4 and IPv6 EIGRP share fate?

**Model answer:** Same AS/design philosophy helps ops, but metrics/interfaces differ; verify both AFs independently. Stub/summary must be applied per AF as designed.

**Common wrong answer:** Assuming IPv4 neighbor up proves IPv6 AF is up.

## Q7 — Minimal named mental model

**Q:** Recite the named hierarchy.

**Model answer:** `router eigrp NAME` → `address-family ipv4/ipv6 unicast AS` → `af-interface` / `topology base` → networks/neighbors/redistribute as needed.

**Common wrong answer:** Putting `network` statements only in classic style outside AF and expecting IPv6 to work.

## Cross-links

[Named structure](../13_Named_Mode_and_Configuration/01_Named_Mode_Structure.md), [IPv6 fundamentals](../14_IPv6_EIGRP/01_EIGRP_for_IPv6_Fundamentals.md), [RID requirement](../14_IPv6_EIGRP/02_Router_ID_Requirement.md).

---
