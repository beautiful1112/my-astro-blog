# Route Refresh

Route Refresh lets a speaker ask its peer to resend Adj-RIB-Out for an AFI/SAFI without resetting the session. It enables policy reevaluation when the receiver did not retain an unmodified soft-reconfiguration copy.

Enhanced Route Refresh adds beginning/end markers that make refresh boundaries explicit and support stale-route handling during policy refresh.

A refresh can cause significant CPU and update load. Change control should estimate affected prefixes and peers before issuing broad refreshes.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
