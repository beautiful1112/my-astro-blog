# BGP Troubleshooting Chain to Memorize

**transport → session → capability → received → policy → eligible → best → RIB/FIB → export → remote → forwarding**

## Per-stage one-liners

1. **Transport:** ping/traceroute peer; ACL/CoPP; update-source; TTL/GTSM; MD5/AO.
2. **Session:** FSM state; last NOTIFICATION; ASN/local-as match.
3. **Capability:** AFI/SAFI activated; refresh/GR/ADD-PATH/ORF negotiated.
4. **Received:** Adj-RIB-In / received-routes / receive-protocol / BMP.
5. **Policy:** prefix, AS-path, RPKI, first-AS, max-prefix, allowas-in count.
6. **Eligible / best:** LP, AIGP, MED scope, RR hiding, weight.
7. **RIB/FIB:** NH recursion; AD vs static; CEF/FT; labels.
8. **Export:** outbound map; split horizon; SoO; conditional adv; ORF.
9. **Remote:** peer’s import; looking glass.
10. **Forwarding:** bidirectional probe; uRPF; asymmetry.

## Five views flash card

Received → Accepted → Best → Installed → Advertised.

## PE-CE fork

If same-ASN CE sites: verify allowas-in **or** as-override design, then SoO on PE→CE—see [toolkit](../18_MPLS_L3VPN/08_PE_CE_AS_Loop_Toolkit.md).

## Ops order

Mirror [Operational Inspection Order](../21_Operations_and_Observability/01_Operational_Inspection_Order.md).

---
