# Path-Attribute Memory Table

| Attribute | Scope/type | Preferred value | Main purpose |
|---|---|---|---|
| ORIGIN | Well-known mandatory | IGP < EGP < INCOMPLETE | Origination method |
| AS_PATH | Well-known mandatory | Shorter | Path/loop information |
| NEXT_HOP | Well-known mandatory | Must resolve | Forwarding recursion |
| LOCAL_PREF | Well-known discretionary | Higher | Exit choice inside AS |
| MED | Optional non-transitive | Lower | Adjacent-AS ingress hint |
| ATOMIC_AGGREGATE | Well-known discretionary | N/A | Warn of lost aggregate detail |
| AGGREGATOR | Optional transitive | N/A | Identify aggregator |
| Communities | Optional transitive family | Policy-defined | Tag/action signaling |

Mnemonic for common early comparisons:

**Local intent → path length → origin → MED → session type → IGP cost.**

Always verify the platform's actual sequence.

---

