# Case: campus L2 explosion

## Symptom

Company-wide outage after a loop in one closet. STP diameter was the whole campus. Voice, PCI, and printers shared VLANs “for simplicity.”

## R/C/A (after the fact)

- R: contain a L2 fault to one closet; 15 min building restore is not enough if the DC dies too
- C: existing access switches, limited change windows
- A: none written—assumed STP would “just work”

## Options

| A | B |
|---|---|
| L3 to access / routed uplinks | Keep L2, but VLAN per closet + BPDU guard + no stretch |
| Best isolation | Faster to deploy |

**Pick:** phased B then A. Immediate: prune trunks, split VLANs, BPDU guard. Target: L3 access in new buildings.

## Lesson

L2 size is a failure domain. “Simplicity” of one VLAN is simplicity of a single blast radius.

---
