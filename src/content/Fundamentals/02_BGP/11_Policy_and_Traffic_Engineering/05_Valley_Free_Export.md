# Customer, Peer, and Provider Export Rules

A common commercial Internet model is valley-free:

- Routes learned from customers may be exported to customers, peers, and providers.
- Routes learned from peers are exported only to customers.
- Routes learned from providers are exported only to customers.

This reflects who pays whom and prevents free transit between peers or providers. Import LOCAL_PREF commonly ranks customer over peer over provider.

Real arrangements can include partial transit, paid peering, route servers, and regional exceptions. Encode the actual contract, not only the textbook model.

A route leak often occurs when a route learned from one peer or provider is incorrectly exported to another. Communities, BGP Roles/OTC, and explicit export matrices provide layered protection.

---

