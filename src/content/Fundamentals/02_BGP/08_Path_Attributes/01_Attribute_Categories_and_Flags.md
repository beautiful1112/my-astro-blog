# Path-Attribute Categories and Flags

BGP path attributes describe a route and influence policy or selection. The attribute header carries four flag bits:

- **Optional:** zero for attributes every compliant implementation must recognize; one for optional attributes.
- **Transitive:** whether an unrecognized optional attribute may cross an AS boundary.
- **Partial:** set when an unrecognized optional transitive attribute has been forwarded without complete understanding.
- **Extended Length:** switches the length field from one octet to two.

The traditional classification is:

| Class | Meaning | Examples |
|---|---|---|
| Well-known mandatory | Recognized by every speaker and required in applicable UPDATEs | ORIGIN, AS_PATH, NEXT_HOP |
| Well-known discretionary | Recognized everywhere but not always present | LOCAL_PREF, ATOMIC_AGGREGATE |
| Optional transitive | Can survive speakers that do not recognize it | AGGREGATOR, standard communities |
| Optional non-transitive | Must not pass through an unaware speaker | MED |

Do not confuse “transitive attribute” with “route is always exported.” Export policy can remove or reject a route regardless of its attributes.

## Interview checkpoint

An unknown optional transitive attribute is propagated with the Partial bit set. An unknown optional non-transitive attribute is quietly discarded.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
