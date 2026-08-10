# PIM Dense Mode

PIM Dense Mode assumes receivers are present on most branches. It starts from data and removes unwanted branches, the opposite of sparse mode's explicit-join behavior.

## Flood-and-prune process

1. A source starts sending. Its DR forwards traffic to all PIM-DM interfaces except the RPF incoming interface.
2. Each router accepts the flow only if it arrived on the RPF interface toward `S`, then floods it further.
3. A leaf router with no local membership or downstream interest sends an `(S,G)` Prune upstream.
4. When an upstream router has pruned every downstream branch, it propagates a Prune toward the source.
5. The remaining interfaces form a source-rooted forwarding tree.
6. Prune state is temporary. On expiry, traffic can reflood and unused branches prune again.

Dense-mode state is source-specific; there is no RP, Register, shared `(*,G)` discovery tree, or ASM SPT switchover.

```text
Source S ---- R1 ==== flood ==== R2 ==== flood ==== R3 (no receivers)
                              \                    prune (S,G)
                               \---- R4 ---- receivers
```

## Graft

If a receiver appears on a pruned branch, the last-hop router sends a Graft upstream rather than waiting for prune expiry. Each router acknowledges with Graft-Ack and propagates the Graft until it reaches active forwarding state. Data then resumes down the new branch.

Graft retransmission handles a lost Graft or acknowledgment. A working membership join with no successful upstream Graft produces delay until the control exchange succeeds or prune state expires.

## State refresh

The original PIM-DM design depended on periodic reflooding as soft-state recovery. The optional State Refresh mechanism lets the source DR originate refresh messages so prune state can remain without repeated data floods. Support and interoperability must be confirmed across the complete domain.

Without State Refresh, prune expiry causes another flood-prune cycle—costly for high-rate groups even when the steady-state tree is sparse.

## Assert and multiaccess links

Several RPF-valid routers can forward the same stream onto a shared LAN. PIM Assert selects one forwarder per `(S,G)` based on route preference, metric, and address. DR election does not decide this.

## Trade-offs

| Strength | Cost |
|---|---|
| no RP/source-registration design | initial traffic reaches every RPF-valid branch |
| receiver can recover with Graft | per-source state and Graft reliability |
| reasonable in a small truly dense domain | periodic reflood or State Refresh complexity |
| simple source-rooted data path | unwanted high-rate traffic before pruning |

PIM-DM is a poor default for sparse high-rate market-data receivers: even short refloods can congest unused branches, and a new source creates state throughout the domain before interest is known. Operators almost always prefer PIM-SM ASM or SSM for market-data plants.

## Configuration patterns

Dense mode is interface-mode specific. Exact knobs and State Refresh defaults vary; confirm release notes before production use.

### Cisco IOS / IOS XE

```text
ip multicast-routing

interface GigabitEthernet0/0
 description Dense-mode LAN / transit
 ip address 198.51.100.1 255.255.255.0
 ip pim dense-mode
!
! Optional: keep prune state without periodic data reflood
ip pim state-refresh origination-interval 60
```

Some platforms also support `ip pim sparse-dense-mode` so Auto-RP discovery groups flood while other groups stay sparse—that is a bootstrap compromise, not a recommendation to run market data as dense.

### Junos

```text
! Classic PIM dense-mode is limited / not the usual Junos multicast design.
! Prefer PIM sparse (ASM or SSM). If a lab still needs dense behavior,
! verify the exact release supports mode dense on the interface and
! State Refresh interoperability with the peer vendor.
set protocols pim interface ge-0/0/0.0 mode dense
```

Treat Junos dense-mode as exceptional. Production Juniper multicast designs almost always use sparse interfaces with explicit RP or SSM policy.

### FRRouting

```text
router
 ip multicast-routing
!
interface eth0
 ip address 198.51.100.1/24
 ip pim
 ! FRR historically centers on sparse/SSM; confirm dense-mode
 ! and state-refresh support for the installed version before use.
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **RPF check** | Flooded packets accepted only on the RPF interface toward `S` |
| **PIM Assert** | Elects one forwarder on multiaccess LANs after duplicate flood |
| **IGMP/MLD** | Local membership suppresses prune / triggers Graft |
| **State Refresh** | Extends prune lifetime without data reflood |
| **Sparse-dense / Auto-RP** | Dense treatment of discovery groups only—not user feeds |
| **PIM-SM / SSM** | Preferred for sparse high-rate distribution |

## Verification

1. Confirm every interface intended for DM is actually in dense (or sparse-dense) mode.
2. Start source `192.0.2.10` to group `239.10.10.10` and observe flood before prune.
3. On a leaf with no receivers, verify `(S,G)` prune toward the RPF neighbor.
4. Join a receiver on a pruned branch; capture Graft / Graft-Ack and resumed OIL.
5. Check Assert winner if two routers flood the same LAN.
6. If State Refresh is enabled, confirm refresh messages and that prune does not expire into a full reflood.

```text
show ip pim interface
show ip mroute 192.0.2.10 239.10.10.10
show ip mroute count
show ip pim neighbor
debug ip pim dense
tcpdump -eni eth0 ip proto 103
```

## Risks

- Initial or periodic flood of high-rate market-data groups onto unused branches.
- Mixed dense/sparse mode boundaries that black-hole or over-flood across domains.
- Incomplete State Refresh support causing silent prune expiry and reflood storms.
- Assuming DR priority selects the Assert forwarder.
- Using sparse-dense “because Auto-RP needs it” and accidentally densing production groups.

## Interview framing

“PIM-DM floods then prunes a source tree—no RP—and Graft restores pruned branches; State Refresh avoids periodic reflood. It is rarely appropriate for sparse high-rate market data compared with SSM or PIM-SM.”

---
