# Interview: Why Does RPKI Not Stop Every Route Leak?

## Question

If RPKI origin validation is deployed, why can route leaks still happen?

## Strong answer

RPKI ROAs authorize a prefix→origin ASN pairing (with maxLength). A leak often advertises a **Valid** origin along a **wrong path** (for example, a customer exporting provider routes to another provider). Origin remains correct; valley-free policy is violated.

Stopping leaks requires export policy discipline, prefix filters, and mechanisms such as BGP Roles / Only-To-Customer (OTC) communities—not ROAs alone. Invalid origins and leaks are different failure classes.

## Follow-ups

- Valid / Invalid / NotFound actions?
- maxLength TE pitfall?
- What does OTC do on receipt?

## Cross-links

[Route leaks](../17_RPKI_and_Leak_Prevention/07_Route_Leaks.md), [Roles and OTC](../17_RPKI_and_Leak_Prevention/08_BGP_Roles_and_OTC.md), [Leak case](../24_Practical_Cases/07_Route_Leak_Creates_Unintended_Transit.md).

---
