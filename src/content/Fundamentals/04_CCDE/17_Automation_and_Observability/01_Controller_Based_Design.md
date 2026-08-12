# Controller-based design

A controller is a **central control/management/policy** component. Design its HA, southbound reachability, backup, and what happens when it is gone.

SD-WAN, ACI, SDA, wireless, and cloud-managed campuses all fit. The exam is not “which GUI,” it is **planes and fate**.

If Day-0 requires the controller but Day-2 forwarding does not, say so. If both do, the controller cluster is in the RTO budget.

## Interview framing

“I design the controller as a system with RTO: cluster, reachability, and whether forwarding survives its death.”

---
