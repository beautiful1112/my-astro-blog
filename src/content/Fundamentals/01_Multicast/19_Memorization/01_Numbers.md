# Numbers to memorize

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

```text
IPv4 multicast:       224.0.0.0/4
IPv4 SSM:             232.0.0.0/8
IPv4 admin scope:     239.0.0.0/8
IPv4 multicast MAC:   01:00:5e + low 23 group bits
IPv4 aliases/MAC:     32
IPv6 multicast:       ff00::/8
IPv6 SSM:             ff3x::/32
IPv6 multicast MAC:   33:33 + low 32 destination bits
IGMP IP protocol:     2
PIM IP protocol:      103
MSDP transport:       TCP/639
All-PIM IPv4/IPv6:    224.0.0.13 / ff02::d
PIM Hello defaults:   30 s period / 105 s holdtime
PIM J/P defaults:     60 s period / 210 s holdtime
PIM Register defaults: 60 s suppression / 5 s probe
PIM Assert default:   180 s
IGMPv3 Report:        224.0.0.22, type 0x22
IGMPv3 defaults:      RV 2, QI 125 s, QRI 10 s, LMQI 1 s
```

Timer values are RFC defaults, not guarantees of a particular platform configuration.

