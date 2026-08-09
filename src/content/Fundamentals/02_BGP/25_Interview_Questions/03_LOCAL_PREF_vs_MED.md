# Interview: LOCAL_PREF vs MED

## Question

Compare LOCAL_PREF and MED. When does each matter?

## Strong answer

**LOCAL_PREF** is local to your AS (and propagated over iBGP). Higher wins, and it is evaluated **early**—before AS_PATH length. Use it for outbound exit preference among multiple paths inside your network.

**MED** (MULTI_EXIT_DISC) is a hint to an upstream to prefer one entry point into **your** AS. Lower usually wins, but comparison is typically only among paths from the **same neighboring AS**. MED is weaker and later than LOCAL_PREF; remote networks may ignore it.

| Goal | Prefer |
|---|---|
| Choose which upstream we use to leave our AS | LOCAL_PREF |
| Influence which of our borders a *single* neighbor AS uses to reach us | MED / communities |
| Influence unrelated third AS | Prepend/communities; not MED myths |

## Follow-ups

- What does `always-compare-med` change?
- Why can prepend fail when remote LP differs? ([case](../24_Practical_Cases/04_LOCAL_PREF_Beats_Shorter_AS_Path.md))
- Where does AIGP sit relative to these?

## Cross-links

[MED case](../24_Practical_Cases/05_MED_Not_Compared_Across_Upstreams.md), [AIGP](../08_Path_Attributes/11_AIGP.md).

---
