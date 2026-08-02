# AS_PATH, ORIGIN, and MED Comparisons

After high-priority local policy, common algorithms compare:

1. Shorter AS_PATH.
2. Lower ORIGIN code: IGP, then EGP, then INCOMPLETE.
3. Lower MED, normally only between paths from the same neighboring AS.

Important exceptions:

- AS_SET counting and confederation segments have special handling.
- A platform may ignore prepended copies of the local ASN under certain inbound features.
- always-compare-med broadens MED comparison and can change results dramatically.
- Missing MED treatment is configurable on some systems.

These are lexicographic comparisons, not a weighted score. Once one path wins on an earlier criterion, later criteria do not compensate.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
