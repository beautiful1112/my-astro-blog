# Lab: Best-Path Attribute Ladder

## Topology

R1 learns the same test prefix through R2 and R3.

## Objectives

Prove that best-path selection is lexicographic.

## Tasks

1. Start with equal paths and record the final tie-breaker.
2. Set higher LOCAL_PREF on the previously losing path.
3. Remove it and prepend AS_PATH on one path.
4. Equalize paths, change ORIGIN, then MED.
5. Change the IGP cost to each next hop.
6. At every step, record the **first differing criterion**.

## Expected result

An earlier attribute prevents later attributes from being considered. MED scope may require both routes to come from the same neighboring AS or a deliberate comparison knob.

---

