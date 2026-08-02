# BGP finite-state machine

The six core states are:

```text
Idle -> Connect -> OpenSent -> OpenConfirm -> Established
          \-> Active --/
```

- **Idle:** resources reset; awaiting start/retry.
- **Connect:** TCP connection in progress.
- **Active:** TCP attempt failed; listening/retrying. “Active” does not mean working.
- **OpenSent:** OPEN sent, awaiting peer OPEN.
- **OpenConfirm:** OPEN accepted, awaiting KEEPALIVE.
- **Established:** UPDATE, KEEPALIVE, Route Refresh, and NOTIFICATION exchange permitted.

State transitions plus last-reset reason provide a faster diagnosis than repeatedly testing IP ping.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
