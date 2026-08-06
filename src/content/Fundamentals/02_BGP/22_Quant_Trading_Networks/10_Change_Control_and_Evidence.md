# Change Control and Evidence for Critical BGP Paths

A trading-network change record should include:

- Exact peers, families, prefixes, and policies.
- Expected best-path and advertisement deltas.
- Pre/post route snapshots.
- Traffic, loss, latency, and FIB evidence.
- External route visibility where relevant.
- Rollback conditions and command.
- Market-calendar risk window.

Configuration success is not completion. The change is complete only when control-plane state, hardware forwarding, and service measurements agree with intent.

---

