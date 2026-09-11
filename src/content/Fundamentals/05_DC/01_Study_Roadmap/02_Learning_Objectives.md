# Learning objectives

After working this library, you should be able to design and defend a securities data-center fabric of this class.

## Architecture

- Draw a 4-spine, 60-leaf Clos with dedicated service and border leaves.
- Keep general compute, trading A/B, and service insertion as separate failure domains.
- State when Layer 1 / FPGA fan-out belongs on the exchange path instead of the EVPN fabric.

## Underlay and overlay

- Explain the underlay contract: loopbacks reachable, fast failure detection, no tenant prefixes.
- Compare eBGP (RFC 7938 pattern) with OSPF/IS-IS for a repeatable Clos.
- Separate VXLAN encapsulation from EVPN control plane.
- Narrate Type-2, Type-3, and Type-5 roles, symmetric IRB, and distributed anycast gateways.

## Tenancy and services

- Map business VRF → L3VNI → L2VNI → RT, and explain why overlapping `10.10.10.50` is safe until it leaks.
- Originate a per-VRF default from the firewall or service edge and withdraw a dead exit.
- Insert firewalls and load balancers on service leaves without turning every leaf into a policy device.

## Market data, time, and latency

- Identify a feed as VRF + source + group + channel + A/B sequence domain.
- Prefer SSM; place an ASM RP only on a tenant-routing node.
- Track P50 / P99 / P99.9 across exchange, switching, NIC, feed handler, and strategy.
- Describe dual PTP grandmasters with BMCA and boundary/transparent clocks.

## Operations

- Treat fabric and CNI as adjacent routing systems; budget double encapsulation.
- Automate intent, evidence, and rollback together.
- Troubleshoot duplicate IP from identity → MAC → EVPN route → VTEP → port.
- Write acceptance tests for baseline, failure, performance, and operations.

## Related

- [How to use this guide](01_How_to_Use_This_Guide.md)
- [Recommended default](../14_Validation/02_Recommended_Default.md)

---
