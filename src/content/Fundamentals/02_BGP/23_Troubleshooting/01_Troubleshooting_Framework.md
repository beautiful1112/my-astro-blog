# BGP Troubleshooting Framework

Write the problem as one testable statement:

“On router R, in VRF V and AFI/SAFI F, prefix P from peer N is/is not received, accepted, best, installed, advertised, or forwarding.”

Then walk one direction without skipping:

**transport → session → capability → received → policy → eligible → best → RIB/FIB → export → remote selection → forwarding**

## Evidence rules

1. Collect timestamps from both ends before changing policy.
2. Name the **view** (received vs accepted vs advertised)—see [Five Route Views](../21_Operations_and_Observability/05_Received_Accepted_Best_Installed_Advertised.md).
3. Prove the failing stage with a command output, not a hypothesis.
4. Change only what the failing stage implicates.

## Stage → common causes (cheat sheet)

| Stage | Common causes |
|---|---|
| Transport | ACL, wrong update-source, multihop TTL, MD5/AO mismatch |
| Session / capability | Family not activated, collision, Hold mismatch |
| Received | Peer not originating/exporting; ORF |
| Policy accept | Prefix/AS-path/RPKI; `allowas-in` count |
| Best | LP, AIGP, MED scope, RR hiding |
| Install | Unresolved NH, AD conflict, label |
| Export | Split horizon, SoO, conditional adv, outbound deny |
| Forwarding | Asymmetry, uRPF, blackhole NH |

## Advanced-feature forks

If the topology uses PE-CE same-ASN designs, branch early into [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md), [as-override](../12_eBGP_and_iBGP/07_AS_Override.md), and [SoO](../18_MPLS_L3VPN/07_Site_of_Origin.md). If comparing interior cost across AS boundaries, verify [AIGP](../08_Path_Attributes/11_AIGP.md).

Avoid changing policy until the failing stage is proven.

## Write it down

Before changing anything, fill:

```text
Router: ____  VRF/AF: ____  Prefix: ____  Peer: ____
Fails at stage: transport|session|recv|policy|best|install|export|fwd
Evidence command + timestamp: ____
Predicted fix scoped to that stage: ____
```

This prevents shotgun soft-clears and accidental allowas-in on Internet edges.

---
