# BGP Core Facts to Memorize

- BGP-4 base specification: RFC 4271.
- Transport: TCP port 179; reliable ordered delivery—not route authorization.
- FSM: Idle, Connect, Active, OpenSent, OpenConfirm, Established.
- Message types: OPEN, UPDATE, NOTIFICATION, KEEPALIVE; ROUTE-REFRESH is an extension.
- Classic maximum message length: 4096 octets; Extended Messages can raise it to 65535.
- Four-octet compatibility ASN: AS_TRANS 23456.
- Full-mesh iBGP sessions: \(n(n - 1) / 2\).
- Higher LOCAL_PREF wins; evaluated before AS_PATH length.
- Shorter AS_PATH usually wins (after LP / origin rules).
- Lower MED usually wins within the configured comparison scope (typically same neighbor AS).
- Best BGP route is not necessarily installed (AD, unresolved NH, table-map).
- Longest-prefix match is a forwarding decision across different prefix lengths.
- eBGP TTL default 1; multihop/GTSM are explicit exceptions.
- iBGP split horizon: do not advertise iBGP-learned to iBGP without RR/confederation.
- Soft-reconfiguration stores Adj-RIB-In; route-refresh re-requests without reboot.
- RPKI Valid ≠ leak-free; OTC/roles address many leak classes.
- Session Established ≠ data-plane OK.

## Advanced PE-CE / metric facts (must know)

- **allowas-in:** accept routes containing local ASN (bounded count); relaxes eBGP loop check—see [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md).
- **as-override:** PE replaces customer ASN in AS_PATH toward CE so CE does not drop inter-site routes—see [as-override](../12_eBGP_and_iBGP/07_AS_Override.md).
- **SoO:** extended community; PE suppresses routes with matching SoO toward that site—see [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md).
- **AIGP:** RFC 7311 optional non-transitive accumulated IGP metric; lower better; trusted domains only—see [AIGP](../08_Path_Attributes/11_AIGP.md).
- Rule of thumb: allowas-in / as-override without SoO on dual-homed sites ⇒ loop risk.

---
