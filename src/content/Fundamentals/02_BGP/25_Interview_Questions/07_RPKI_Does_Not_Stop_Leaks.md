# Interview: Why Does RPKI Not Stop Every Route Leak?

## Question

Why can an RPKI-Valid route still be leaked?

## Strong answer

Origin validation checks whether the origin ASN is authorized for the prefix and length. In a leak, the original origin and prefix can remain unchanged while an intermediate AS exports the route to the wrong relationship. The route can remain Valid. Relationship-aware export policy, BGP Roles/OTC, community controls, maximum-prefix, and monitoring address the leak problem.

---

