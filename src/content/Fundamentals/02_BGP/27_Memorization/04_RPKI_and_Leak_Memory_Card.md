# RPKI and Route-Leak Memory Card

## RPKI states

| State | Meaning | Typical edge action |
|---|---|---|
| Valid | ROA covers prefix/origin/length | Prefer |
| Invalid | Origin/length disagrees with ROA | Reject |
| NotFound | No covering ROA | Accept with care / lower LP |

- ROA **maxLength** must cover TE more-specifics or they become Invalid.
- RTR feeds VRPs from validators to routers.

## What RPKI does *not* do

- Does not validate the full AS_PATH.
- Does not stop valley-free / customer-provider **leaks** of Valid origins.
- Is not BGPsec.

## Leak prevention toolkit

| Tool | Role |
|---|---|
| Strict export prefix lists | Primary |
| Peer/customer communities | Classification |
| BGP Roles + OTC | Signal/drop leak paths |
| Max-prefix | Blast-radius limit |

## Flash questions

1. Valid origin leaked to two providers—RPKI state? → Still Valid.
2. /25 TE under ROA maxLength 24—state? → Invalid.
3. Who must filter exports—you or RPKI? → You (and OTC helpers).

Cross-links: [RPKI module](../17_RPKI_and_Leak_Prevention/README.md), [Interview](../25_Interview_Questions/07_RPKI_Does_Not_Stop_Leaks.md).

---
