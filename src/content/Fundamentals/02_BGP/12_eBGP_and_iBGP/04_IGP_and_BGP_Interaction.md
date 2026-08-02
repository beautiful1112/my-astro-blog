# IGP and BGP Interaction

The IGP should normally provide stable reachability to router loopbacks and BGP next hops. BGP carries policy-rich external or service routes.

Important interactions:

- An unresolved BGP next hop makes a path ineligible or unusable.
- IGP metric changes can change hot-potato exit selection.
- Redistributing the full Internet table into an IGP is unsafe and unnecessary.
- Redistributing IGP routes into BGP without strict policy can leak infrastructure space.
- Recursive convergence can require IGP recovery before BGP paths become usable.

Keep responsibilities explicit: the IGP reaches the BGP next hop; BGP decides which destination path is preferred.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
