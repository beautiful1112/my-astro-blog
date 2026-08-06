# Reliability above IP multicast

Common mechanisms are:

- packet/message sequence numbers;
- redundant A/B multicast feeds;
- first-copy arbitration and duplicate suppression;
- unicast retransmission for small gaps;
- snapshot/recovery feed for large gaps or late starts;
- heartbeat, session, and reset messages;
- forward-error correction in some media systems;
- explicit stale-state rules.

Ordinary ACKs do not scale: thousands of receivers can create feedback implosion, and one slow receiver should not throttle the group.

