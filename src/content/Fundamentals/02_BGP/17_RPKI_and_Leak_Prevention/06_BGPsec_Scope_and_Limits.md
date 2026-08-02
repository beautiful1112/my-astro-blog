# BGPsec Scope and Limits

BGPsec adds cryptographic signatures intended to validate the sequence of AS-path propagation. It addresses a broader problem than RPKI origin validation.

It does not automatically validate commercial export relationships, stop every route leak, or prove the physical forwarding path. Deployment also requires protocol support, cryptographic processing, and coordinated adoption across participating ASes.

For interviews, distinguish:

- RPKI/ROV: deployed origin authorization.
- BGPsec: path-signature mechanism.
- BGP Roles/OTC and policy: relationship-based leak prevention.

These controls are complementary.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
