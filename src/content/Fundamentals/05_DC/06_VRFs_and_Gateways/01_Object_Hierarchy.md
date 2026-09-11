# Object hierarchy

VRFs separate routing; L3VNIs identify their overlay transit domains; L2VNIs identify bridge domains. Route targets decide what is imported — not the VNI alone.

```text
Business tenant
  └── VRF
        └── L3VNI  (overlay transit for that VRF)
              ├── L2VNI / subnet / anycast GW
              └── RT import / export
```

VRF, VNI, RT, VLAN, and gateway are one validated object in automation. Do not assign them independently and hope they line up.

## Related

- [Overlapping addresses](02_Overlapping_Addresses.md)
- [Symmetric IRB](../04_EVPN_VXLAN/03_Symmetric_IRB.md)
- [Generated facts and change safety](../12_Automation/02_Generated_Facts_and_Change_Safety.md)

---
