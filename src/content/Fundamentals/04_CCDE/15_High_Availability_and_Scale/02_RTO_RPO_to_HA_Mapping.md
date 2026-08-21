# RTO / RPO to HA mapping

**RTO** (recovery time objective) is how long the business tolerates the service being down or degraded. **RPO** (recovery point objective) is how much data loss is tolerable. Network design maps RTO to **mechanisms and failure domains**; RPO is mostly storage and application replication—the network’s job is not to invent fake storage HA or stretch L2 “for DR.”

## Order-of-magnitude mapping

| RTO (order of mag.) | Typical network tools | What must already exist |
|---|---|---|
| Hours | Cold spare, tickets, restore configs, truck roll | Documented inventory, off-box backups |
| Minutes | Dual box, FHRP/anycast GW, IGP reconverge, runbook | Independent paths, tested failover |
| Seconds | BFD, LFA/TI-LFA/FRR, stateful HA, dual underlay | Pre-computed backup, tuned detect |
| Sub-second | FRR, ECMP, lossless fabric tricks, app anycast | Dual active paths; app designed for it |

If the business will not fund two independent paths, the honest design is a **longer RTO**, not a slide that says “HA” on one fiber.

## RPO vs network

| Concern | Owner | Network contribution |
|---|---|---|
| Database RPO 0 / minutes | Storage, DB replication, app | Stable, diverse paths; do not stretch L2 by accident |
| “Seamless” vMotion across DCs | Often claimed as network RPO | Usually a **shared fate** purchase—challenge it |
| Config RPO | Backup of device/controller state | Out-of-band backup; controller HA ≠ config history |

```text
Business: "RTO 30s for branch POS, RPO 0 for ledger"
Network:  dual underlay + fast detect + local DIA for POS
App/DB:   sync replication / quorum  ← network does not invent this
```

## Real-world — hospital that bought “seconds” on one path

**Claimed RTO:** 5 seconds for EHR access.

**Built:** Dual firewalls in HA pair, single upstream ISP, single building entrance.

**What happened:** Provider POP maintenance → 40-minute outage. Stateful HA never saw a second path.

**Honest rewrite:** RTO for **provider loss** is hours unless a second underlay exists. Keep firewall HA for **box** failure only; name both RTOs.

## Real-world — finance DR that confused RPO with L2 stretch

**Wanted:** RPO near zero and “instant” failover between DC-A and DC-B.

**Proposed:** Stretched VLANs so VMs keep IPs.

**Design pushback:** Stretch merges flood and control domains → violates independent-site RTO. Prefer L3 DCI, anycast/DNS, app-level sync. Buy stretch only for a named cluster with residual risk written down.

## Mapping worksheet (use in HLD)

1. For each critical service, write **RTO** and **which failure** it covers (box, link, site, IdP, region).
2. List mechanisms that meet that RTO for that failure.
3. If mechanism requires a second domain and budget refuses it → **lengthen RTO** in writing.
4. Separate **detection**, **switchover**, and **human** time; sum them.

```text
Voice RTO 30s, failure = primary DIA cut
  Detect (BFD/SLA probe): ~1–3s
  Switch to LTE TLOC:     ~5–15s
  Call recovery:          app-dependent
  Sum must fit 30s — or change RTO / underlay
```

## Risks

- One RTO number for “the network” with no failure class.
- Equating dual power supplies with site DR.
- Using NSF/GR to claim path HA.
- Promising RPO via stretched L2 without app ownership.

## Interview framing

“I map RTO to mechanisms and failure classes. I lengthen RTO before I invent HA that shares a single fiber. RPO is mostly app and storage; I will not stretch L2 to fake it.”

## Related

- [Failure domains](01_Failure_Domains.md)
- [FHRP, NSF, GR, and BFD](03_FHRP_NSF_GR_BFD.md)
- [RPO, RTO, ROI, and cost](../03_Business_Strategy/03_RPO_RTO_ROI_and_Cost.md)
- [Fate sharing](04_Fate_Sharing.md)
- [Case: SD-WAN without underlay](../19_Practical_Cases/05_SDWAN_Without_Underlay.md)

---
