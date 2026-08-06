# NLRI and longest-prefix match

BGP selects a best path separately for each NLRI prefix. Packet forwarding then uses **longest-prefix match** across installed routes.

Therefore a less-preferred `/24` still wins packet forwarding over a highly preferred covering `/16`. BGP attributes compare competing paths for the same prefix; they do not override forwarding longest-prefix match.

This distinction explains many traffic-engineering surprises and hijack impacts.

---

