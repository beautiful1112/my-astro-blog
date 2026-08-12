# DiffServ end to end

DiffServ is **stateless PHB** from DSCP. IntServ/RSVP is per-flow signaling—rare in enterprise, sometimes in SP TE.

End-to-end means **every congestion point** honors a compatible map: campus, WAN, SP, DC, cloud. One remark in the SP that zeros DSCP kills the campus policy.

```text
Trust at access -> DSCP AF/EF
WAN/SP: SLA or remark map (document it)
DC: same classes or a documented collapse
```

Cloud often **does not** honor your EF. Design for that (local breakout, private interconnect, or accept best effort).

## Interview framing

“DiffServ only works if every congestion point shares a map. I document remarking and I do not assume the public cloud will honor EF.”

---
