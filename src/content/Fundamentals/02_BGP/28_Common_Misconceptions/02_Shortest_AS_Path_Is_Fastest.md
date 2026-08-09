# Misconception: Shortest AS Path Is Fastest

## The myth

“The path with the fewest AS hops is the lowest latency / best path for trading.”

## Why it is wrong

AS_PATH length is a policy loop-prevention and tie-break signal, not a latency metric. A two-AS path may traverse a continent; a three-AS path may stay on a local exchange fabric. LOCAL_PREF and AIGP (inside trusted domains) routinely prefer “longer” AS_PATH paths intentionally.

Longest-prefix match can also send traffic to a more-specific with worse attributes.

## Quick counterexample

Path A: AS_PATH length 2 via distant transit (80 ms). Path B: length 4 via local IX fabric (800 µs). LP prefers B for order VIP. Shortest AS_PATH would pick the worse trade path.

## Correct habit

Measure one-way latency and loss; map results to LOCAL_PREF classes with hysteresis. Use AS_PATH prepend only as an inbound *hint*. See [Latency-aware control](../22_Quant_Trading_Networks/03_Latency_Aware_Path_Control.md) and [LOCAL_PREF vs AS_PATH case](../24_Practical_Cases/04_LOCAL_PREF_Beats_Shorter_AS_Path.md).

---
