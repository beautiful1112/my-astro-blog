# Interview: Why Might AS Prepending Fail?

## Question

Why might remote traffic ignore your AS-path prepending?

## Strong answer

Remote networks may apply LOCAL_PREF before path length, use a different provider path, ignore excessive prepends, or select a more-specific route. Prepending only influences routes that reach a comparison where AS_PATH length matters. Provider communities or selective advertisements can be more precise, but remote policy remains authoritative.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
