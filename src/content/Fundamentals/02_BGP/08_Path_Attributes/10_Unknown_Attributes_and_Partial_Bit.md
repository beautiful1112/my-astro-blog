# Unknown Attributes and the Partial Bit

BGP is extensible because a speaker can safely handle attributes it does not recognize:

- Unknown **optional transitive** attributes are retained, forwarded, and marked Partial.
- Unknown **optional non-transitive** attributes are discarded.
- Malformed attributes follow RFC 7606 error-handling rules; where safe, the affected NLRI is treated as withdrawn instead of resetting the entire session.

This distinction lets new policy metadata cross older routers without requiring a flag day.

When packet captures show an unknown attribute, decode its flags before declaring it harmful. A session reset, route withdrawal, attribute discard, or propagation decision depends on the exact error and flags.

---

