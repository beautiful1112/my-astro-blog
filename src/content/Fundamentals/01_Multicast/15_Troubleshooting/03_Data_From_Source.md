# Follow data from source downstream

1. Verify `(S,G,port)`, egress interface, TTL, and packet size at the source.
2. Confirm the FHR sees traffic and it passes RPF.
3. For ASM, verify Registers at the correct RP.
4. At every branch, compare mroute input and replicated output counters.
5. Confirm hardware matches the control-plane OIL.
6. Verify last-hop switch delivery, NIC receipt, socket queue, and application consumption.

The first observation boundary where the sequence disappears identifies the failure domain.

