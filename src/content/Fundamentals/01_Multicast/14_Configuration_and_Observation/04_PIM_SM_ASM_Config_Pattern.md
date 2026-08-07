# Routed PIM-SM ASM configuration patterns

This example maps ASM group range `239.10.0.0/16` to RP `10.255.0.1`. A source uses VLAN 100, receivers use VLAN 200, and routed transit uses a port-channel. Syntax is illustrative and must be verified for the exact platform release.

## Cisco IOS-like pattern

```text
ip multicast-routing

ip access-list standard ASM-GROUPS
 permit 239.10.0.0 0.0.255.255

ip pim rp-address 10.255.0.1 group-list ASM-GROUPS

interface Vlan100
 description ASM source LAN
 ip pim sparse-mode

interface Port-channel10
 description Routed PIM core link
 ip pim sparse-mode

interface Vlan200
 description ASM receiver LAN
 ip pim sparse-mode
 ip igmp version 3
```

On the RP itself, `10.255.0.1/32` should be a stable loopback and reachable through the MRIB. Use control-plane and source Register policy appropriate to the platform.

## Junos-like pattern

```text
set protocols pim interface irb.100
set protocols pim interface ae10.0
set protocols pim interface irb.200
set protocols pim rp static address 10.255.0.1 group-ranges 239.10.0.0/16
set protocols igmp interface irb.200 version 3
```

The same mapping must be present on every PIM router that handles the group. Dynamic mapping such as BSR can replace the static RP line; do not configure both without understanding precedence.

## RP-side controls

Production RP policy should include:

- explicit served group prefixes;
- permitted registering source prefixes;
- PIM Register/Register-Stop control-plane policing sized for legitimate churn;
- RP loopback/service health monitoring;
- Anycast or documented failover design;
- MSDP or PIM Anycast synchronization if physical RPs share one anycast address;
- exclusion of the SSM range.

## SPT policy

Choose deliberately whether LHRs switch immediately, after a rate threshold, or remain on the RPT. The command is platform-specific. Validate the operational result:

```text
before: (*,G) IIF toward RP
switch: (S,G) Join toward source
after:  SPT bit set, source-facing IIF, (S,G,rpt) prune toward RP
```

For low-latency feeds, immediate SPT is typical. For many low-rate sources, an RPT-only policy can reduce source-specific state but increases RP-tree dependence.

## Verification sequence

1. verify exact `RP(G)` on FHR, LHR, transit router, and RP;
2. verify RPF toward RP on the LHR path;
3. observe `(*,G)` Join reach RP;
4. start source and observe Data Register outer/inner headers;
5. verify RP `(S,G)` Join and source RPF;
6. verify native data, Register-Stop, and later Null-Register;
7. verify RPT forwarding to receiver;
8. verify optional LHR SPT transition and RPT prune;
9. compare TIB/mroute state with MFIB/ASIC replication.

## Failure tests

- RP route withdrawal;
- RP process failure while loopback route remains;
- new receiver during RP failure;
- new source during RP failure;
- loss of Register-Stop;
- Anycast synchronization partition;
- source RPF change during registration;
- BSR/RP mapping change while data is on SPT;
- receiver forced to remain RPT-only.

An established SPT surviving is not proof that the ASM control plane is resilient.
