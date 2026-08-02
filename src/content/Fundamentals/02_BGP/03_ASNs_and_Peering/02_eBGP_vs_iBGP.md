# eBGP versus iBGP

eBGP peers use different ASNs; iBGP peers use the same ASN.

Important default differences commonly include:

- eBGP prepends the local ASN on advertisement; iBGP does not.
- eBGP commonly changes NEXT_HOP; iBGP normally preserves it.
- routes learned from one iBGP peer are not advertised to another iBGP peer unless route reflection or confederation rules apply.
- directly connected eBGP commonly uses a low TTL and direct neighbor reachability; iBGP often uses loopbacks and IGP recursion.

These are protocol behaviors and widespread defaults, but exact TTL, next-hop handling, and policy defaults must be verified per platform.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
