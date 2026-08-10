# PIM Source-Specific Multicast

Source-Specific Multicast changes the receiver request from “send me group `G` from any source” to “send me group `G` only from source `S`.” The receiver learns `(S,G)` out of band—from configuration, DNS/service discovery, or an application feed definition—so the network does not need an RP to discover the source.

## Complete flow

1. The application requests an SSM membership for `(S,G)` on a specific interface.
2. The host sends IGMPv3/MLDv2 source-filter state equivalent to `INCLUDE {S}`.
3. The LHR validates that `G` belongs to its configured SSM range and records source-specific local interest.
4. It performs RPF toward `S` and sends a PIM `(S,G)` Join to that upstream neighbor.
5. Each router installs `(S,G)` state and propagates the Join toward `S` until it reaches the source LAN or existing tree.
6. Data from `S` passes RPF and follows the reverse of that Join path to receivers.
7. Removal of the final local/downstream source-specific interest sends a Prune or lets state expire.

The source may already be transmitting or may start later. There is no Register probe: existing `(S,G)` Join state is ready when traffic begins.

```text
Host INCLUDE(S) --> LHR --PIM (S,G) Join--> ... --> FHR / source LAN
                          data S-->G follows reverse path
```

## What disappears

SSM has no:

- `(*,G)` shared tree;
- RP mapping or BSR/Auto-RP dependency;
- PIM Register or Register-Stop;
- ASM source discovery;
- MSDP SA exchange; or
- RPT-to-SPT transition—the initial tree is source-rooted.

PIM Hellos, Join/Prune soft state, MRIB/RPF, snooping, membership timers, MFIB programming, TTL, capacity, and application loss handling still apply.

## Address ranges

The standardized IPv4 SSM range is `232.0.0.0/8`. IPv6 SSM addresses use the `ff3x::/32` format with the appropriate scope nibble. Operators can configure an expanded IPv4 SSM range, but every router and receiver-facing policy must agree; otherwise one router may treat a group as ASM while another treats it as SSM.

## IGMPv2/MLDv1 receivers and SSM mapping

Older membership protocols cannot signal `S`. Some networks use SSM mapping to translate a group-only join into a statically or dynamically provisioned source, but this reintroduces mapping operations and usually supports only limited source semantics. Native IGMPv3/MLDv2 is clearer and should be preferred.

### Cisco IOS / IOS XE mapping sketch

```text
ip access-list standard SSM-RANGE
 permit 232.0.0.0 0.255.255.255
ip pim ssm range SSM-RANGE

ip igmp ssm-map enable
ip igmp ssm-map static 192.0.2.10 232.10.10.10

interface Vlan200
 ip address 198.51.100.1 255.255.255.0
 ip pim sparse-mode
 ip igmp version 2
```

### Junos mapping sketch

```text
set protocols pim ssm group-range 232.0.0.0/8
set protocols igmp ssm-map MAP1 source 192.0.2.10
set protocols igmp ssm-map MAP1 group 232.10.10.10/32
set protocols igmp interface irb.200 ssm-map-policy MAP1
set protocols igmp interface irb.200 version 2
```

Treat mapped `S` as policy, not host truth. Full membership recipes live in [IGMP/MLD config patterns](../14_Configuration_and_Observation/13_IGMP_MLD_Config_Patterns.md); end-to-end routed SSM in [PIM-SSM config pattern](../14_Configuration_and_Observation/03_PIM_SSM_Config_Pattern.md).

## Security boundary

SSM prevents traffic from an unwanted **different source address** from matching receiver state, but it does not authenticate `S`. Source-address spoofing, compromised approved sources, and on-path injection remain threats. Enforce source address validation near sources and `(S,G)` allowlists at boundaries.

## Configuration patterns

Sparse-mode interfaces carry SSM; the distinguishing control is the SSM group range plus IGMPv3/MLDv2 (or an explicit map). Do not configure an RP for groups inside the SSM range.

### Cisco IOS / IOS XE

```text
ip multicast-routing

ip access-list standard SSM-RANGE
 permit 232.0.0.0 0.255.255.255
ip pim ssm range SSM-RANGE

interface Vlan100
 description source LAN for 192.0.2.10
 ip address 192.0.2.1 255.255.255.0
 ip pim sparse-mode

interface Port-channel10
 ip address 198.51.100.1 255.255.255.252
 ip pim sparse-mode

interface Vlan200
 description receiver LAN
 ip address 198.51.200.1 255.255.255.0
 ip pim sparse-mode
 ip igmp version 3
```

### Junos

```text
set protocols pim interface irb.100 mode sparse
set protocols pim interface ae10.0 mode sparse
set protocols pim interface irb.200 mode sparse
set protocols pim ssm group-range 232.0.0.0/8
set protocols igmp interface irb.200 version 3
```

### FRRouting

```text
router
 ip multicast-routing
 ip pim ssm prefix-list SSM-RANGE
!
ip prefix-list SSM-RANGE seq 5 permit 232.0.0.0/8
!
interface vlan100
 ip pim
!
interface eth-core
 ip address 198.51.100.1/30
 ip pim
!
interface vlan200
 ip pim
 ip igmp
 ip igmp version 3
```

Expand with policy, RPF, and failure tests in [03_PIM_SSM_Config_Pattern.md](../14_Configuration_and_Observation/03_PIM_SSM_Config_Pattern.md).

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMPv3 / MLDv2** | Native signaling of `INCLUDE {S}` |
| **SSM mapping** | Translates group-only joins into configured `S` |
| **RP / BSR / Auto-RP** | Must not claim the SSM range |
| **MSDP** | Not used for SSM source discovery |
| **MBGP / MRIB** | RPF toward `S` only |
| **Boundary ACL** | Filter unwanted `(S,G)` Joins and data |
| **Snooping** | Must preserve source-specific membership |

## Verification

1. Verify the socket joined the correct source, group, and interface.
2. Decode the IGMPv3/MLDv2 source list; a group-only join is not proof of SSM.
3. Confirm identical SSM range configuration across routers.
4. Follow `(S,G)` Join state hop by hop toward `S`.
5. Verify source MRIB/RPF, not RP reachability.
6. Check that snooping supports the required group/source behavior.
7. Confirm data source address exactly matches `S` and passes policy.
8. Negative checks: no `(*,G)`, Register, RP map, or MSDP SA required for the channel.

```text
show ip pim group-map 232.10.10.10
show ip igmp groups detail
show ip mroute 192.0.2.10 232.10.10.10
show ip rpf 192.0.2.10
show ip pim rp mapping
tcpdump -ni eth0 igmp
```

## Risks

- SSM range mismatch: one hop treats `G` as ASM and looks for an RP.
- IGMPv2-only hosts without a correct SSM map—Joins never become `(S,G)`.
- Relying on SSM alone against spoofed source addresses.
- Mapping drift when DNS or static `S` entries change under the hosts.
- Forgetting `(S,G)` boundary filters on external edges.

## Interview framing

“SSM is receiver-driven `(S,G)` Join toward the source with no RP, Register, or MSDP—IGMPv3 signals `S`, and the standardized IPv4 range is `232/8`. Prefer it for controlled one-to-many market data.”

---
