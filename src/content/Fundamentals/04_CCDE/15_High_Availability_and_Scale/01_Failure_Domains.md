# Failure domains

A failure domain is everything that **goes wrong together**. Draw them on purpose: L2 VLAN, IGP area, RR cluster, controller, power zone, provider, identity system.

Good design **nests** small domains inside larger ones without stretching the small ones.

```text
Closet  < building  < campus  < region  < company
VLAN      summary      IGP       BGP       policy/identity
```

If identity (IdP/ISE) is a single global domain, the campus L3 hierarchy will not save a login outage. Name that domain.

## Interview framing

“I list failure domains before I add a second box. Two boxes in one domain are not two domains.”

---
