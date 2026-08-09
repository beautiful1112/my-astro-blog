# Operational Inspection Order

Use the same sequence for every BGP incident. Skipping stages produces false confidence (“session is Established, so routing is fine”).

## Ordered checklist

1. **Scope the object.** Exact prefix (or NLRI), AFI/SAFI, VRF/RD, and router. Note whether the complaint is control-plane, data-plane, or both.
2. **Session health.** Peer state, uptime, last reset reason/NOTIFICATION, negotiated capabilities, AFI activation, and prefix counters (received / accepted / advertised).
3. **Received (pre-policy).** Did the peer send the NLRI? Soft-reconfig / Adj-RIB-In / BMP / receive-protocol views answer this.
4. **Accepted (post-import).** Prefix lists, AS-path filters, RPKI, first-AS, max-prefix, communities, `allowas-in` loop checks—anything that can drop Adj-RIB-In before selection.
5. **Eligible paths and best.** Compare all candidates and the documented best-path reason (LOCAL_PREF, AS_PATH, AIGP, MED, IGP cost, RID, …).
6. **Installation.** Next-hop recursion, administrative distance vs static/IGP, RIB→FIB programming, VRF/label binding for VPN/EVPN.
7. **Advertisement.** Export policy, iBGP split-horizon / RR rules, ORF, conditional advertisement, SoO suppression toward a CE.
8. **Forwarding.** Bidirectional traceroute/ping, CEF/FT, uRPF, and return-path policy. Control plane can be perfect while the data plane fails.

## Evidence discipline

Record timestamps, command output (or hashes), and which view you used (received vs accepted). For PE-CE designs, note whether `as-override`, `allowas-in`, SoO, or `local-as` is in play:

- [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md)
- [as-override](../12_eBGP_and_iBGP/07_AS_Override.md)
- [Site-of-Origin](../18_MPLS_L3VPN/07_Site_of_Origin.md)
- [local-as](../12_eBGP_and_iBGP/08_Local_AS.md)

## Worked mini-example

Symptom: “VIP unreachable,” session Established.

1. Scope: `203.0.113.50/32`, ipv4-unicast, global, edge-1.
2. Session: Established, 2 accepted, 1 advertised — not a transport fault.
3. Received: peer sent covering `/24`.
4. Accepted: `/32` never existed; only `/24` accepted.
5. Best: `/24` via transit LP 100; exchange path missing.
6. Install: CEF to transit NH OK.
7. Advertised: N/A for inbound VIP.
8. Forwarding: traceroute follows transit (high latency), not exchange.

Root cause was missing exchange prefix / LP class, visible only after naming the prefix and views—not from “BGP up.”

## Anti-patterns

- Declaring “BGP is up” without prefix counters and FIB proof.
- Clearing all sessions to “refresh policy.”
- Comparing AS_PATH length before confirming LOCAL_PREF / AIGP equality.
- Ignoring return-path policy when the symptom is one-way loss.

Map each failure class to [Troubleshooting](../23_Troubleshooting/README.md) and the five views in [Five Route Views](05_Received_Accepted_Best_Installed_Advertised.md).

---
