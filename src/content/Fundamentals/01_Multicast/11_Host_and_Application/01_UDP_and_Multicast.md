# UDP and multicast

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Multicast is not synonymous with UDP, but real-time applications commonly use UDP because it is message-oriented and carries no per-receiver connection state. TCP's acknowledgements, ordering, flow control, and congestion state are per connection and do not naturally map to a dynamic multicast group.

UDP supplies ports and checksum/error detection, not recovery, ordering, duplicate suppression, pacing, or receiver feedback. Applications implement those properties when needed.

