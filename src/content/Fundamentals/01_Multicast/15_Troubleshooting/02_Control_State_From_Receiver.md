# Follow control state from receiver upstream

1. Did the socket join the intended interface?
2. Is the IGMP/MLD Report visible on the access link?
3. Does the switch have the listener and mrouter ports?
4. Does the LHR have local membership and receiver OIF?
5. For SSM, does `(S,G)` Join state propagate toward `S`?
6. For ASM, is RP mapping correct and does `(*,G)` state propagate toward the RP?

An IGMP Report proves only local interest signaling.

