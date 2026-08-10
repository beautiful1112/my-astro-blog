# Topology base and VRF

Named mode places routing policies that apply to the AF’s topology under **`topology base`**. VRF-aware deployments use address-families that bind to VRFs so each VRF runs its own EIGRP instance context.

## Topology base

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   variance 2
   maximum-paths 4
   redistribute ospf 1 metric 100000 100 255 1 1500 route-map OSPF-TO-EIGRP
   distribute-list prefix FILTER out GigabitEthernet0/1
  exit-af-topology
 exit-address-family
```

Think of `topology base` as the classic process-level knobs that are not interface-scoped: variance, maximum-paths, redistribute, offset-list, distribute-list, traffic-share (as supported).

Multi-topology EIGRP (beyond base) exists on some platforms for class-specific topologies—most enterprise designs use **base only**.

## VRF-aware named mode

```text
router eigrp CORP
 !
 address-family ipv4 unicast vrf TENANT-A autonomous-system 100
  network 10.1.0.0
  af-interface GigabitEthernet0/0.10
   no passive-interface
  exit-af-interface
  topology base
  exit-af-topology
 exit-address-family
```

Each VRF AF has its own neighbors, topology table, and AS context. Router-ID and stub are per AF.

## Verification

```text
show eigrp address-family ipv4
show eigrp address-family ipv4 vrf TENANT-A neighbors
show ip route vrf TENANT-A eigrp
```

## Risks

- Redistributing between VRF and global without RT/leak design → leaks.
- Same AS number reused across VRFs intentionally for PE-CE—document; do not assume global uniqueness of EIGRP AS on a PE.
- Configuring variance under AF but outside topology when the image expects topology base.

## Interview framing

“topology base holds AF-wide routing knobs; VRF uses per-vrf address-family. Base topology is the default single topology.”

## Related

- [Named mode structure](01_Named_Mode_Structure.md)
- [Variance unequal cost](../12_Load_Balancing/02_Variance_Unequal_Cost.md)
- [Route maps with EIGRP](../11_Stub_Filtering_and_Split_Horizon/07_Route_Maps_with_EIGRP.md)

---
