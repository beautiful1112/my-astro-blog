# CCDE learning objectives

By the end of this library you should **design and defend**, not merely recognize technologies. Objectives map to how Written and Practical grade answers.

## Outcome objectives

| ID | You can… | Evidence of mastery |
|---|---|---|
| O1 | Translate business need into R/C/A | Numbered list; no “we want VXLAN” as a requirement |
| O2 | Compare ≥2 designs with an explicit loser | Table: buy / spend / discarded option |
| O3 | Bound failure domains | Diagram + blast-radius sentence |
| O4 | Place control, data, management (and policy) | Plane sketch under load and under outage |
| O5 | Choose IGP/BGP/MPLS/L2 tools by fit | “When not” as clear as “when” |
| O6 | Map RTO/RPO to HA mechanisms | Cold vs hot path justification |
| O7 | Segment for security/compliance | PEP placement and trust boundaries |
| O8 | Plan brownfield migration | Phases, risk, rollback |
| O9 | Design for ops and automation | Change velocity without cowboy risk |
| O10 | Speak under interview/Practical time | 60 s defense + scenario method |

## Blueprint alignment (v3.1 style)

```text
Business / governance     → O1, O6, O7
Architecture / planes     → O3, O4
Layer 2–3 / routing       → O5
WAN / campus / DC / cloud → O2, O5, O6
Security / automation     → O7, O9
Migration / method        → O8, O10
```

Exact topic lists change; the **skills** above do not. Study technologies as levers for these outcomes.

## Depth targets by module type

| Module type | Objective depth |
|---|---|
| Mindset / business | R/C/A fluency; trade-off vocabulary |
| Planes / L2 / routing | Topology + failure + summarization |
| MPLS / EVPN / multicast | When tool fits; control vs data roles |
| Campus / WAN / DC / cloud | End-to-end HA and seam design |
| Security / auto / migrate | Policy points, CI/CD, cutover plan |
| Cases / interview | Timed synthesis of all above |

## Real-world — hiring a staff network architect

**Brief:** Company wants “CCDE-ready” thinkers for a multi-region hybrid estate.

| R / C / A | Statement |
|---|---|
| R | Candidate can defend a campus+WAN+cloud HLD in 20 minutes |
| C | Interviewers are not CCIE lab graders |
| A | Cert alone proves O1–O10 — false without scenario work |

**Screen:** Ask for one discarded design and one fate-share they refused. Score O2 and O3 first; protocol trivia last.

## Self-check rubric

| Score | Meaning |
|---|---|
| 0 | Slogan only (“use leaf-spine”) |
| 1 | Can list pros/cons from memory |
| 2 | Applies to a given scenario with R/C/A |
| 3 | Names risk, migration, and measurement |

Aim for **2** on every O before booking Practical; **3** on O1–O4 and O8.

## Risks

- Treating objectives as a reading checklist instead of a performance checklist.
- Over-investing in one protocol library while O1/O2 stay weak.
- Confusing “I know the blueprint list” with “I can design under constraint.”

## Interview framing

“My learning goal is not more protocols—it is to map any brief to R/C/A, pick a fit design, and show why the popular alternative loses.”

## Related

- [How to study CCDE](01_How_to_Study_CCDE.md)
- [Written versus Practical](03_Written_vs_Practical.md)
- [Official CCDE topics](../23_References/01_Official_CCDE_Blueprint.md)

---
