# Case: Best BGP Route Loses to a Static Route

## Symptom

BGP marks 203.0.113.0/24 best, yet the forwarding table points to a static next hop.

## Reasoning

Best-path selection compares BGP candidates. Main-RIB selection then compares route sources using administrative distance or preference.

## Proof

The route table lists the BGP path as inactive and the static route as active with a more preferred protocol distance.

## Correction

Confirm whether the static route is intentional. Adjust route-source preference or remove the stale static only under approved design.

## Lesson

“Best BGP path” does not mean “installed route.”

---

