# Official CCDE blueprint

Primary sources (always prefer these over third-party slides):

- [CCDE v3.1 unified exam topics](https://learningnetwork.cisco.com/s/ccde-v3-1-unified-exam-topics) — Written + Practical domains
- [CCDE exams and training](https://www.cisco.com/site/us/en/learn/training-certifications/certifications/design/ccde/exams-and-training.html)
- Core and elective **technology lists** linked from the unified topics page (download current PDFs before you sit)
- Written/Practical **exam format** PDF from the same page (closed book; Practical module structure)

v3.1 (from Feb 2025 sitting window) adds AI/ML, observability/UX, zero trust, and technology-list updates; format stayed Written MCQ + 8-hour Practical with core + elective.

These notes track that public blueprint. They are not Cisco official training and not a substitute for the current PDF lists.

## Study checklist — before you claim coverage

Use this as a **weekly board**, not a cram list. Tick only when you can speak R/C/A + one discard + one failure for the topic.

### Business strategy and governance

- [ ] Map RTO/RPO/ROI to HA spend without inventing tech first
- [ ] State risk appetite and continuity tiers (what may degrade)
- [ ] Sovereignty / residency: where data may live and traverse
- [ ] Sustainability vs diversity trade-offs (power, sites, vendors)

### Architecture and traffic flow

- [ ] Control / data / management planes under named failures
- [ ] Overlay vs underlay: what dies when underlay dies
- [ ] Hierarchy and summarization placement
- [ ] Centralized vs distributed control — when each is wrong

### Layer 2 and campus

- [ ] Flood / failure domain bounds; STP as loop tool not blast-radius cure
- [ ] L2 vs L3 access decision for a real campus constraint set
- [ ] MLAG/vPC: local HA, not metro stretch excuse
- [ ] VLAN/broadcast design with voice / PCI / IoT separation

### Routing, MPLS, WAN

- [ ] IGP choice and area/level/query-domain bounds
- [ ] When enterprise needs BGP; RR/confederation scale story
- [ ] MPLS/SR VPN: why PE holds tenants, P stays dumb
- [ ] EVPN as control; RT topology = service topology
- [ ] SD-WAN needs underlay diversity; hub site fate, not twin VM
- [ ] Internet edge / multihoming policy without leaking into IGP

### Data center and cloud

- [ ] Leaf-spine + EVPN local; L3 DCI default
- [ ] Named L2 stretch only when proven; storm isolation test
- [ ] Cloud hybrid placement and on-ramp by app class
- [ ] AI/ML fabric isolation cues from current technology list

### Security, automation, migration

- [ ] CIA in design language; segmentation and PEP placement
- [ ] NAC / zero trust as policy architecture, not a product logo
- [ ] Controller-based design: change path vs forwarding path
- [ ] Observability / UX as blueprint domains (v3.1)
- [ ] Migration phases with rollback; practical time and traps

### How to use the official PDFs

1. Download **current** unified topics + core/elective tech lists the week you schedule.
2. Diff against last download; mark new AI/observability/zero-trust bullets.
3. For each domain, link one note from this library and one personal incident.
4. Practical: rehearse 8-hour pacing with core + elective selection, not endless reading.

### Hygiene

- Prefer Cisco Learning Network / cisco.com links over undated slide decks.
- Re-check format PDF for closed-book rules and module timing.
- These Fundamentals notes support judgment; they do not replace the blueprint PDFs.

## Related

- [Blueprint domain card](../21_Memorization/02_Blueprint_Domain_Card.md)
- [How to study CCDE](../01_Study_Roadmap/01_How_to_Study_CCDE.md)
- [Learning objectives](../01_Study_Roadmap/02_Learning_Objectives.md)

---
