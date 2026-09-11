# SSM, ASM, and BUM

## SSM — known publishers

IGMPv3 receivers request `(S,G)` directly. No RP or shared tree is required; RPF still follows unicast reachability to the source.

This is the default for exchange feeds when sources are known.

## ASM — receiver discovery

The LHR joins `(*,G)` toward the RP. The FHR registers sources; traffic may switch to an `(S,G)` shortest-path tree.

## Do not conflate planes

Underlay multicast used for VXLAN BUM replication is separate from tenant market-data multicast inside a VRF.

## RP placement

If spines have no tenant VRFs, they cannot act as in-VRF RPs for tenant ASM merely because they are physical spines. Place the RP on a participating tenant-routing node, a dedicated multicast gateway, or use SSM to remove the RP dependency.

## Related

- [A/B independence](02_AB_Independence.md)
- [LAN roles and loss controls](04_LAN_Roles_and_Loss_Controls.md)
- [ASM and SSM](../../01_Multicast/03_Service_Models_and_Terminology/02_ASM_and_SSM.md)
- [RP placement](../../01_Multicast/09_Rendezvous_Point/04_RP_Placement.md)

---
