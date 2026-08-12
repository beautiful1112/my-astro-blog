# FHRP, NSF, GR, and BFD

- **FHRP** (HSRP/VRRP/GLBP): first-hop HA for L2 access. Anycast GW in fabrics often replaces it.
- **BFD**: fast detect; tune to the media; avoid flap storms.
- **NSF/GR**: forwarding continues during control restart; peers must play.
- **NSR**: local stateful restart; platform-specific.

These do **not** replace dual paths. SSO/NSF on a single-homed router still dies when the link dies.

## Interview framing

“BFD detects, FHRP/anycast covers the gateway, NSF/GR covers control restart. None of them create a second physical path.”

---
