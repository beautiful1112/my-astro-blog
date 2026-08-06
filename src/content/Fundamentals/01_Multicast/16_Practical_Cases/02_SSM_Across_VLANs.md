# Case 2: SSM across routed receiver VLANs

For source `192.0.2.10` and group `232.10.10.10`, each LHR translates an IGMPv3 `INCLUDE {192.0.2.10}` report into `(192.0.2.10,232.10.10.10)` PIM Join state. RPF paths converge toward the source. No RP state should appear.

Interview trap: PIM-SM ASM needs an RP; PIM-SSM does not.

