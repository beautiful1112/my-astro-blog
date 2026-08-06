# Hold and Keepalive timers

Peers negotiate the Hold Time as the smaller nonzero proposed value. A Hold Time of zero disables periodic keepalive-based expiration. KEEPALIVE is commonly sent at one-third of Hold Time, though behavior is implementation-specific.

If no KEEPALIVE, UPDATE, or acceptable NOTIFICATION-equivalent activity is received before Hold Timer expiry, the session is reset and learned routes are withdrawn unless graceful-restart procedures retain them.

Aggressive timers accelerate failure detection but increase false resets during CPU congestion and do not necessarily detect forwarding-only failure. BFD is often a clearer mechanism.

---

