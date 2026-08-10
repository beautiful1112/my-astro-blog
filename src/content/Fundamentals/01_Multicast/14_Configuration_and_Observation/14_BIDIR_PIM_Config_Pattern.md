# BIDIR-PIM configuration pattern

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

This recipe builds a bidirectional shared tree for group range `239.20.0.0/16` using phantom RP `192.0.2.99`. Sources and receivers inject and join natively; there is no PIM Register path. Theory: [BIDIR-PIM](../08_PIM/06_BIDIR_PIM.md).

## Phantom RP topology

```text
        R-left 198.51.100.1/30 ---- ge link ---- 198.51.100.2/30 R-right
              \                                      /
               \         IGP next-hop toward         /
                \        192.0.2.99/32 meets         /
                 \       on this rendezvous link    /
                  receivers / sources on access LANs
```

Advertise `192.0.2.99/32` from both sides (or from a LAN subnet design) so unicast/MRIB paths converge on the rendezvous link. No router assigns `192.0.2.99` to a PIM Register loopback.

## Design prerequisites

```text
BIDIR groups:   239.20.0.0/16
Phantom RP:     192.0.2.99
Rendezvous:     198.51.100.0/30 between R-left and R-right
Receiver VLAN:  200
Source VLAN:    100 (native send; no Register)
Every PIM hop:  BIDIR mapping + DF-capable forwarding
```

## Cisco IOS / IOS XE

```text
ip multicast-routing
ip pim bidir-enable

ip access-list standard BIDIR-GROUPS
 permit 239.20.0.0 0.0.255.255

ip pim rp-address 192.0.2.99 group-list BIDIR-GROUPS bidir

interface Loopback0
 description management only — not the phantom RP
 ip address 192.0.2.1 255.255.255.255

interface GigabitEthernet0/0
 description rendezvous link
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode

interface Vlan100
 description sources
 ip address 192.0.2.17 255.255.255.240
 ip pim sparse-mode

interface Vlan200
 description receivers
 ip address 198.51.200.1 255.255.255.0
 ip pim sparse-mode
 ip igmp version 3
```

Inject `192.0.2.99/32` into IGP with next hop toward the rendezvous link (static, redistribute carefully, or a shared subnet design). Confirm both sides agree.

## Junos

```text
set protocols pim rp static address 192.0.2.99 group-ranges 239.20.0.0/16 bidir
set protocols pim interface ge-0/0/0.0 mode sparse
set protocols pim interface irb.100 mode sparse
set protocols pim interface irb.200 mode sparse
set protocols igmp interface irb.200 version 3
set routing-options static route 192.0.2.99/32 next-hop 198.51.100.2
```

Adjust the static or IGP advertisement so the phantom next hop is the rendezvous peer, not a black hole.

## FRRouting

```text
router
 ip multicast-routing
 ip pim rp 192.0.2.99 239.20.0.0/16
 ! Verify BIDIR flag / phantom-RP behavior for this FRR release
!
interface eth-rendezvous
 ip address 198.51.100.1/30
 ip pim
!
interface vlan100
 ip pim
!
interface vlan200
 ip pim
 ip igmp
```

FRR BIDIR support varies by version; lab the DF election and `(*,G)` forwarding before production.

## Verification

```text
show ip pim rp mapping
show ip pim group-map 239.20.10.10
show ip rpf 192.0.2.99
show ip pim df
show ip pim df 192.0.2.99
show ip mroute 239.20.10.10
show pim join extensive
show pim df extensive
```

Expected outcomes:

1. mapping for `239.20.0.0/16` shows BIDIR and RP `192.0.2.99`;
2. RPF toward `192.0.2.99` points at the rendezvous design;
3. each link has one DF winner toward that RP;
4. receiver join creates `(*,G)` with OIL toward receivers;
5. source traffic appears without Register/Register-Stop;
6. no requirement for `(S,G)` SPT state in the BIDIR core.

## Failure tests

| Inject | Expect |
|---|---|
| Shut DF winner on a LAN | New DF wins; brief loss possible |
| Withdraw `192.0.2.99` on one side | Tree root direction moves or black-holes—measure |
| Map same group as sparse ASM on one router | Broken tree / unexpected Registers |
| Look for SPT / Register | Should remain absent for BIDIR groups |
| Dual sources on two LANs | Both climb via local DF; shared-tree stretch |

## Risks

- Phantom route inconsistency between left and right halves.
- Forgetting `bidir` on the RP mapping so the domain stays unidirectional SM.
- Hardware paths that do not implement DF correctly.
- Using BIDIR for latency-sensitive one-to-many feeds better suited to SSM.

---
