# Case 9: TTL confusion

The source uses TTL 1. Same-VLAN receivers work, but receivers beyond one router do not, even though membership and PIM state are correct.

Set sufficient TTL for the intended routed path and enforce distribution scope with boundaries and ACLs rather than relying on TTL as security policy.

