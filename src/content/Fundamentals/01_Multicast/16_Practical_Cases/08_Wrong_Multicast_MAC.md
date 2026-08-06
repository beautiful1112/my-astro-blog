# Case 8: Wrong multicast MAC calculation

An operator tries to encode all 28 group bits in the Ethernet address, so frames do not match the intended filter.

Correct rule: use prefix `01:00:5e`, force the high bit of the fourth MAC octet to zero, and copy only the low 23 IPv4 group bits.

