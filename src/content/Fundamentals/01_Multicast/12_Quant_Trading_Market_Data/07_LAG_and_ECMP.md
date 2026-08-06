# LAG and ECMP considerations

One multicast flow may hash to a single member, so a 4×10G bundle does not guarantee a 15G `(S,G)` can pass. Validate:

- hash inputs and polarization;
- multicast pinning, replication, or rehash behavior;
- RPF selection after member/path failure;
- transient duplication or reordering;
- snooping and PIM state across MLAG peers.

Aggregate capacity is not per-flow capacity.

