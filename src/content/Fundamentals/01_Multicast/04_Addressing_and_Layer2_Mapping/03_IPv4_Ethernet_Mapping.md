# IPv4-to-Ethernet multicast mapping

IPv4 multicast maps to `01:00:5e:00:00:00` through `01:00:5e:7f:ff:ff`. Copy only the **low 23 bits** of the IPv4 group.

For `239.1.2.3`:

```text
239.1.2.3 = EF:01:02:03
MAC       = 01:00:5e:01:02:03
```

In byte form, the mapped suffix is `(second IPv4 octet & 0x7f):third:fourth`.

IPv4 multicast has 28 variable group bits but Ethernet preserves 23, so 32 IP groups alias to one MAC. The NIC/IP stack must perform final destination filtering, and limited NIC multicast-filter capacity can increase host CPU load. ARP is not used because the mapping is algorithmic.

