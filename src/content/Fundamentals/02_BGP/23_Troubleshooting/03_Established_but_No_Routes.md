# Established but No Routes

An Established session proves only that TCP and BGP OPEN negotiation succeeded.

Check per AFI/SAFI:

- Was the family activated and negotiated?
- Is an explicit import/export policy attached?
- Does the origin router have the exact route needed to advertise?
- Do prefix/AS-path/community filters permit it?
- Is default-reject behavior active?
- Is maximum-prefix state suppressing the family?
- Did the peer actually advertise any NLRI?

Compare received, accepted, and advertised counters on both ends.

---

