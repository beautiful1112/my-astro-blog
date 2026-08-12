# HA and failure-domain card

```text
RTO hours  -> procedures, cold
RTO min    -> dual box, IGP, FHRP
RTO sec    -> BFD, FRR/LFA, dual path
RPO        -> app/storage, not a second SVI
```

Hunt shared fate: fiber, PDU, ToR, controller, IdP, L2, one Ansible play.

Two logos ≠ two domains.

Controller/IdP: forwarding vs change vs auth—say which dies.

---
