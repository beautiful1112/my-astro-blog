# TCP, UDP, and QUIC implications

Transport choice is an **application constraint** on the network.

| Transport | Network sensitivity |
|---|---|
| TCP | Loss → backoff; bufferbloat and tiny queues both hurt; elephant vs mice |
| UDP | App owns recovery (voice, some multicast); jitter and loss matter |
| QUIC | UDP/443; encryption hides L4; middleboxes that assume TCP break |

Design implications: do not tune WAN as if everything were TCP Reno 1999; do not F5-terminate what you do not understand; firewalls must allow QUIC or force fallback.

Micro-bursts (v3.1): shallow buffers + incast (especially AI/DC) need **lossless or ECN** stories, not just “more QoS classes.”

## Interview framing

“I design for the transport the app actually uses. QUIC and micro-bursts change middlebox and buffer design more than another DSCP class does.”

---
