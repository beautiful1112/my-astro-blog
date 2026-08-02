# Linux multicast inspection

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

```bash
ip -br address
ip route get 192.0.2.10
ip -s link show dev eth0
ip maddr show dev eth0
cat /proc/net/igmp
cat /proc/net/igmp6
ss -uapn
tcpdump -ni eth0 -vv 'igmp or (udp and dst host 239.10.10.10 and dst port 15000)'
ethtool -S eth0
nstat -az
```

Use these to verify interface selection, actual Report transmission, NIC admission, socket ownership, and rising driver/IP/UDP drop counters.

