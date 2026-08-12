# QoS as a design problem

QoS is **who loses when the link is full**. If the link never congests, QoS is mostly marking hygiene. If it does, unmarked voice and backups will fight.

## Design sequence

1. Application classes and contracts (loss/latency/jitter)
2. Trust boundary (usually access / controller / SD-WAN LAN)
3. Marking (DSCP) that survives the domain
4. PHB: queue, WRED, policing, shaping—**where congestion is**
5. Overlay: inner vs outer markings

QoS does not create bandwidth. It **allocates scarcity**. The alternative design is “buy a bigger pipe” when that is cheaper than a 12-class policy nobody understands.

## Interview framing

“QoS is a scarcity policy with a trust boundary. I design classes from applications, mark once, and queue where congestion actually is.”

---
