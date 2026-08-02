# Case 4: Existing ASM data survives RP failure

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Existing receivers are on SPTs, so data bypasses the RP and monitoring remains green. A new receiver joins and receives nothing; a new source cannot register.

Steady-state data does not prove RP health or new-flow convergence. Monitor with synthetic join/register tests as well as packet rates.

