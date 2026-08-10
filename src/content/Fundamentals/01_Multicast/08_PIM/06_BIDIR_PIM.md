# Bidirectional PIM

BIDIR-PIM builds one bidirectional shared tree per group, rooted at an RP **address**. Any source can inject data upward on the tree, and the traffic then travels down all interested branches. The core can avoid per-source `(S,G)` state, which suits many-to-many applications with many sources.

## How it differs from PIM-SM ASM

| Property | PIM-SM ASM | BIDIR-PIM |
|---|---|---|
| tree direction | unidirectional RPT, optional source SPT | one bidirectional shared tree |
| source registration | PIM Registers to actual RP | none |
| core source state | `(S,G)` possible/normal | shared `(*,G)` forwarding state |
| SPT switchover | supported | not part of BIDIR forwarding model |
| loop prevention on LAN | RPF and Assert | Designated Forwarder election per RP/link |

## RP address and rendezvous link

The RP address identifies the root direction through the MRIB. It does not always have to be assigned to a live router; some designs use a **phantom RP** address so routing points toward a resilient rendezvous link. RP mapping must explicitly mark the group range as BIDIR, and every router on the tree must support compatible BIDIR behavior.

```text
          R1 ===== rendezvous link ===== R2
           \         (toward phantom)    /
            \         192.0.2.99         /
             receivers / sources inject via DF on each link
```

A phantom RP is typically a host route (or longer mask) advertised so both sides of a LAN or P2P link prefer next hops that meet at that link—without any router owning the address as a PIM Register endpoint.

## Designated Forwarder

On each link and for each RP, routers elect a Designated Forwarder (DF). Only the DF may forward packets from that link toward the RP, preventing loops when sources send onto a shared tree. The election uses advertised path information to the RP and a tie-breaker.

DF election is distinct from:

- PIM DR, which acts for local hosts in PIM-SM;
- PIM Assert, which reacts to duplicate unidirectional forwarding; and
- IGMP/MLD querier election.

Offer/Win/Lose/Pass DF messages and timers coordinate changes. A topology change must reconverge DF state as well as MRIB reachability.

## Data flow

1. Receiver membership causes `(*,G)` Join state toward the RP address.
2. A source sends natively onto its connected link—no Register tunnel is built.
3. The link's DF accepts/forwards the packet in the RP direction.
4. At each tree branch, data follows interested shared-tree interfaces away from the RP as well as progressing toward the root where required.
5. RPF/DF rules prevent a packet from circulating on the bidirectional tree.

## Trade-offs and operations

BIDIR-PIM reduces core state when many sources send to the same groups, but all traffic uses the shared tree, so path stretch can be permanent. Support, hardware forwarding, Anycast/phantom-RP design, DF election, and interoperability are less universal than PIM-SM/SSM.

Troubleshoot group mapping/mode, MRIB toward RP address, DF winner on every link, `(*,G)` tree state, and native data direction. Looking for Registers or `(S,G)` SPT state is the wrong workflow.

It is rarely the first choice for one-to-many low-latency market data, where SSM provides a direct source tree with simpler semantics.

## Configuration patterns

Mark the group range BIDIR and ensure every PIM router agrees. Phantom RP needs routing toward the rendezvous address, not a Register-capable loopback process.

### Cisco IOS / IOS XE (phantom RP sketch)

```text
ip multicast-routing
ip pim bidir-enable

ip access-list standard BIDIR-GROUPS
 permit 239.20.0.0 0.0.255.255

! Phantom RP address — not assigned to a router interface
ip pim rp-address 192.0.2.99 group-list BIDIR-GROUPS bidir

interface GigabitEthernet0/0
 description rendezvous / transit
 ip address 198.51.100.1 255.255.255.0
 ip pim sparse-mode

interface Vlan200
 ip address 198.51.200.1 255.255.255.0
 ip pim sparse-mode
```

Advertise `192.0.2.99/32` (or an appropriate mask) in IGP so MRIB next hops converge on the intended rendezvous link. Full recipe: [BIDIR-PIM config pattern](../14_Configuration_and_Observation/14_BIDIR_PIM_Config_Pattern.md).

### Junos

```text
set protocols pim rp local address 192.0.2.99 group-ranges 239.20.0.0/16 bidir
! Or static mapping when the address is phantom / remote:
set protocols pim rp static address 192.0.2.99 group-ranges 239.20.0.0/16 bidir
set protocols pim interface ge-0/0/0.0 mode sparse
set protocols pim interface irb.200 mode sparse
```

Confirm the platform treats the range as bidirectional and that DF election appears in operational state.

### FRRouting

```text
router
 ip multicast-routing
 ip pim rp 192.0.2.99 239.20.0.0/16
 ! Confirm BIDIR / phantom-RP support for the installed FRR version;
 ! syntax and bidir flags are release-specific.
!
interface eth0
 ip pim
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **DF election** | One upward forwarder per link toward each RP address |
| **PIM DR** | Still may exist for Hellos; does not replace DF |
| **Assert** | Unidirectional SM/SSM mechanism—not the BIDIR loop control |
| **Phantom RP routing** | MRIB must point both sides at the rendezvous link |
| **PIM Register** | Not used; native injection only |
| **SSM / SPT** | Outside BIDIR model for those groups |

## Verification

1. Confirm group-to-RP mapping shows BIDIR for `239.20.10.10`.
2. Verify MRIB/RPF toward the RP address (phantom or real) on every hop.
3. On each multiaccess link, identify the DF winner toward that RP.
4. Join a receiver; install `(*,G)` toward the RP—no Register expected when a source starts.
5. Source on a non-DF router: traffic must reach the DF then climb the tree.
6. Fail the DF or RP route and measure reconvergence—not SPT formation.

```text
show ip pim rp mapping
show ip pim df
show ip pim df 192.0.2.99
show ip mroute 239.20.10.10
show ip rpf 192.0.2.99
show pim join extensive
show pim df extensive
```

## Risks

- Mixed BIDIR/non-BIDIR mapping for the same group range across the domain.
- Phantom RP route pointing at the wrong link or black-holing the root.
- Operators hunting Registers or `(S,G)` SPT state that will never appear.
- DF flapping from unstable metrics toward the RP address.
- Using BIDIR for one-to-many market data when SSM would be simpler and lower stretch.

## Interview framing

“BIDIR-PIM is one bidirectional shared tree per group with Designated Forwarder election toward the RP address—no Registers or per-source core state; phantom RP is a routing trick so the root is a link, not a box.”

---
