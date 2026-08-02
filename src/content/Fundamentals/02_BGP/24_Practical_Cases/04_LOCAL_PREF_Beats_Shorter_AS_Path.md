# Case: LOCAL_PREF Beats a Shorter AS Path

## Symptom

The router selects AS_PATH “64510 64520 64530” instead of the shorter “64540”.

## Reasoning

The longer route arrived from a customer and received LOCAL_PREF 200. The shorter provider route has LOCAL_PREF 80.

## Proof

Both paths are eligible; LOCAL_PREF is the first differing criterion.

## Correction

No protocol fix is required if commercial policy is intentional. If latency intent differs, adjust the documented relationship/per-prefix policy, not an arbitrary later attribute.

## Lesson

BGP selection is lexicographic. A later shorter AS path cannot overcome an earlier LOCAL_PREF difference.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
