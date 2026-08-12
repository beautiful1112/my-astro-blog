# DCI patterns

Default DCI is **L3**. L2 stretch (OTV, VXLAN, dark fiber VLANs) is a purchased fate-share.

| Pattern | Use |
|---|---|
| L3 + DNS/GSLB / anycast | Most apps |
| L2 stretch | Clusters that truly need it; isolated VNIs |
| Backup-only DCI | Cheap, honest RTO hours |
| Active-active stretched | Hardest; requires app + cluster literacy |

A stretched VLAN plus a single spanning-tree/control mistake takes **both** DCs. If RTO required independent sites, you just violated it.

## Interview framing

“DCI is L3 unless the app proves it needs L2, and then that stretch is a named, isolated risk—not the whole tenant LAN.”

---
