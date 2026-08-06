# Multi-Exit Discriminator

MED suggests which entry point a neighboring AS should prefer when multiple links lead into the advertising AS. Lower is normally better.

Key limitations:

- MED is optional and non-transitive.
- It is usually compared only among routes received from the same neighboring AS, unless a platform is configured for always-compare behavior.
- The neighboring AS may overwrite or ignore it.
- Earlier criteria such as LOCAL_PREF and AS_PATH can dominate it.
- Comparison order can become nondeterministic on some implementations unless deterministic-MED logic is enabled.

MED is most useful when two adjacent ASes coordinate policy across multiple interconnects. It is not a reliable tool for influencing arbitrary distant networks.

Always document whether missing MED is treated as zero, worst, or another value on the target platform.

---

