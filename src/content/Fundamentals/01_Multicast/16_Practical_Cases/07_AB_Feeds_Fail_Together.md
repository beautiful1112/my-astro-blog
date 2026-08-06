# Case 7: A and B feeds fail together

Although A and B use different groups, both cross the same egress switch and enter one NIC queue. A microburst overruns that shared queue, so both copies of the same logical sequence are lost.

Protocol duplication is not failure-domain diversity. Separate paths, switch planes, NICs/queues, and processing threads where required.

