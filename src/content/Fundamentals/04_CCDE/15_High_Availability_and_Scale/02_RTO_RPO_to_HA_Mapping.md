# RTO/RPO to HA mapping

| RTO (order of mag.) | Typical network tools |
|---|---|
| Hours | Cold spare, tickets, restore configs |
| Minutes | Dual box, FHRP, IGP reconverge, runbook |
| Seconds | BFD, LFA/FRR, stateful HA, dual path |
| Sub-second | FRR, ECMP, lossless, app anycast |

RPO is mostly **storage/app replication**. The network’s job is to not lie about bandwidth and not stretch L2 by accident.

If the business will not fund two paths, the honest design is a **longer RTO**, not a fake HA slide.

## Interview framing

“I map RTO to mechanisms and I will lengthen RTO before I invent HA that shares a single fiber.”

---
