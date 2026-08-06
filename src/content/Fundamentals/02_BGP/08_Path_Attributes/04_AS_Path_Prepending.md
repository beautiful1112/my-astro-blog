# AS-Path Prepending

AS-path prepending repeats an ASN during export to make one advertisement appear longer and therefore less attractive to remote networks.

It is an **inbound-traffic hint**, not a deterministic control:

- Remote LOCAL_PREF commonly overrides path length.
- Some networks ignore excessive prepends.
- Different upstreams may see different alternatives.
- A more-specific prefix still beats a less-specific prefix in forwarding.
- Too much prepending can produce unexpected paths or reduce resilience.

Use selective prepend policy per prefix and neighbor, then verify from external looking glasses or route collectors. Never assume the local advertised-routes output proves the Internet selected that path.

For low-latency trading connectivity, communities documented by a provider often provide cleaner regional or peer-specific traffic engineering than indiscriminate prepending.

---

