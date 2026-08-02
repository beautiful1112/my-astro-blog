# Public cloud and virtualization

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Many cloud virtual networks do not provide physical-LAN multicast semantics. Native multicast may be absent, limited, or delivered through a managed transit feature. Hypervisor switches, SR-IOV, security policy, and overlays can independently filter IGMP and data.

Do not infer multicast support from “same subnet.” Verify the current platform and the complete virtual-to-physical path, including observability for bypassed or offloaded traffic.

