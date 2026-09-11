# Silent receiver and blackholes

## One receiver is silent

Check IGMP snooping group and outgoing interfaces, VLAN continuity, querier presence, access port state, NIC multicast membership, and local firewall.

## Route exists, traffic fails

Separate protocol RIB, global RIB, and hardware FIB. Validate recursive next hop, ECMP programming, MTU, ACL, and asymmetric return path.

## Video or feed corruption

Low average bitrate does not rule out microbursts. Inspect egress queue drops, buffer occupancy, burst profile, policers, optics, and application sequence numbers.

## Related

- [Identity to wire](01_Identity_to_Wire.md)
- [LAN roles and loss controls](../08_Market_Data/04_LAN_Roles_and_Loss_Controls.md)
- [Multicast troubleshooting](../../01_Multicast/15_Troubleshooting/README.md)

---
