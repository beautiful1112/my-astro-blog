# Interview: What Is the Risk of Graceful Restart?

## Question

When can BGP Graceful Restart make an outage worse?

## Strong answer

Peers retain stale routes because they assume the restarting router's forwarding plane still works. If the entire device, line card, or data path failed, traffic continues toward a dead next hop until stale timers expire or an alternative wins. GR must be matched to a tested forwarding-survival model.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
