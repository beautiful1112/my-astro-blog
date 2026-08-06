# Internet Exchange Route Servers

A route server exchanges routes among IXP participants while normally staying out of the forwarding path. It commonly does not prepend its ASN and may preserve the participant next hop.

Implications:

- First-AS enforcement may need a route-server exception.
- NEXT_HOP points to the actual participant, so layer-2 reachability and ARP/ND matter.
- Per-client import/export policy still enforces bilateral intent.
- The route-server session can be up while forwarding to another participant fails.

Use BGP Roles where supported and distinguish route-server control-plane reachability from bilateral data-plane connectivity.

---

