# Failure Detection and BFD

BGP detects peer failure through TCP closure, Hold Timer expiry, or dependent mechanisms. **Bidirectional Forwarding Detection (BFD)** can detect data-path failure much faster and signal BGP to invalidate the peer.

Tradeoffs:

- Aggressive timers reduce detection time.
- They also increase CPU sensitivity and the chance of false failure during congestion or control-plane stress.
- Multihop BFD requires special support and careful path interpretation.
- Detecting a failed session does not guarantee an alternate path is already installed.

Tune detection from a loss-budget requirement and platform scale test. For trading traffic, pair fast detection with precomputed backup forwarding and verify under realistic CPU and link-failure conditions.

---

