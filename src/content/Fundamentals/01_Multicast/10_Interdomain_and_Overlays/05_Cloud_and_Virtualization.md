# Public cloud and virtualization

Many cloud virtual networks do not provide physical-LAN multicast semantics. Native multicast may be absent, limited, or delivered through a managed transit feature. Hypervisor switches, SR-IOV, security policy, and overlays can independently filter IGMP and data.

Do not infer multicast support from “same subnet.” Verify the current platform and the complete virtual-to-physical path, including observability for bypassed or offloaded traffic.

## Common platform behaviors

| Environment | Typical multicast reality |
|---|---|
| Classic L2 VLAN / bare metal | Closest to textbook IGMP/PIM |
| Cloud VPC / VNet | Often no customer multicast, or restricted regional feature |
| Overlay (VXLAN/Geneve) | Underlay may carry unicast only; multicast mapped to head-end replication |
| Hypervisor vSwitch | May snoop, flood, or drop Reports based on port security |
| SR-IOV / PCI passthrough | Guest programs NIC filters; hypervisor path bypassed |
| Containers / netns | Join is per-namespace; bridge hairpin and ebtables matter |

Related: [Boundary principle](../13_Security/03_Boundary_Principle.md), [NIC receive path](../11_Host_and_Application/05_NIC_Receive_Path.md).

## Design patterns when native multicast is missing

```text
1. Unicast fan-out from a distributor (app or appliance)
2. Provider-managed multicast transit (document SLOs and groups)
3. Overlay with ingress replication between VTEPs
4. Keep market-data on colo/bare-metal fabrics; use cloud for non-live tiers
```

Trading incremental feeds rarely belong on “best effort VPC multicast” without proving pps, latency, and failure domains.

## Configuration patterns

### Linux bridge / libvirt sketch

```text
# Ensure IGMP snooping querier exists on the bridge if used
# echo 1 > /sys/class/net/br0/bridge/multicast_querier
ip maddr show dev br0
bridge mdb show
tcpdump -ni br0 -vv igmp
```

### Cloud security group / NSG mindset

```text
# Many clouds: allow UDP to group ranges is insufficient or unsupported
# Prefer documenting "multicast not available" and use unicast recovery channels
# If a transit feature exists, allowlist (S,G,port) per vendor docs
```

### SR-IOV guest

```text
# Join in guest; verify VF multicast list
ip maddr show dev eth0
ethtool -S eth0
# Confirm PF/hypervisor is not silently filtering
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **PIM in VM** | Useless if underlay drops multicast Ethernet |
| **IGMP to cloud router** | May terminate or ignore—check provider |
| **Host tuning** | Still applies inside the guest when packets arrive |
| **Overlays** | Encapsulation MTU tax → fragmentation risk |

## Verification

1. Same-subnet test: sender and receiver VMs; capture for Reports **and** data.
2. If Reports exist but no data, check security policy, MDB, and underlay.
3. SR-IOV: compare VF counters with an external TAP on the physical port.
4. Document whether A/B diversity is even possible across AZs.

```text
tcpdump -ni eth0 -vv 'igmp or (udp and dst net 224.0.0.0/4)'
bridge mdb show
ip -s link show
```

## Risks

- Assuming “VPC subnet” equals Ethernet broadcast domain semantics.
- Running PIM-SM in cloud VMs as a cargo-cult without underlay support.
- Losing observability when traffic is offloaded to DPU/SmartNIC paths.

## Interview framing

“Cloud and virtualization often break LAN multicast assumptions—verify IGMP and data on the actual virtual-to-physical path, and design unicast or provider transit when native multicast is absent.”

---
