# CNI and MTU

## Routed integration

A BGP-capable CNI can advertise pod prefixes to top-of-rack switches. Bound prefix counts and policy, summarize where safe, and keep failure domains visible.

Do not let every pod /32 become an unbounded EVPN Type-5 explosion without a scale budget.

## Encapsulation budget

If both the fabric and CNI encapsulate, account for both headers end to end. A 9,000-byte physical MTU does not automatically guarantee a safe pod MTU.

| Layer | Typical extra header |
|---|---|
| VXLAN | 50 bytes (IPv4 underlay, no options) — confirm on the platform |
| CNI overlay (if any) | Depends on VXLAN/Geneve/IP-in-IP |

Prefer a routed CNI (BGP to the leaf) when the fabric already provides isolation, so you do not stack two overlays by accident.

## Related

- [Adjacent routing systems](01_Adjacent_Routing_Systems.md)
- [Underlay contract](../03_Underlay/01_Underlay_Contract.md)

---
