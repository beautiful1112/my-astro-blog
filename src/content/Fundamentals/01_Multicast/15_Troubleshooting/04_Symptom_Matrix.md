# Multicast symptom matrix

| Symptom | Likely causes |
|---|---|
| Nobody receives | source/group/interface/TTL, FHR or RP failure |
| One VLAN fails | membership/PIM state, boundary, LHR OIL/RPF |
| One host fails | wrong NIC join, firewall, ring/socket/app drops |
| Works then stops | missing querier or timer mismatch |
| Join visible, no data | source/RP/RPF/data path |
| Null OIL | no downstream interest or expired/pruned state |
| RPF failures rise | packet arrives on non-selected reverse path |
| Duplicates | dual forwarders, A/B not arbitrated, convergence/loop |
| Burst-only gaps | congestion, NIC ring, socket, scheduling, policing |
| Existing ASM works, new join fails | RP reachability/mapping/synchronization |
| Wrong SSM source received | ASM join, compatibility downgrade, spoofing |

