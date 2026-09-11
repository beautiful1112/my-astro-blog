# A/B independence

Preserve A/B independence; replicate at a deliberate boundary.

Exchange channels A and B use independent network paths to feed handlers, then deliver normalized feeds into trading and production VRFs.

```text
Exchange A -> L1 / A fabric -> Feed handler A -+-> Trading VRF subscribers
                                               +-> Production VRF consumers
Exchange B -> L1 / B fabric -> Feed handler B -+
                                               +-> VRF relay (deliberate boundary)
```

Prefer SSM (IGMPv3 + PIM-SSM) when sources are known. Use ASM only when RP behavior is required.

Replication into a second VRF is a **product boundary**, not an accidental leak. Do not join both raw exchange groups from production hosts “for redundancy” if that couples failure domains.

## Related

- [Feed as a data product](01_Feed_as_Data_Product.md)
- [SSM, ASM, and BUM](03_SSM_ASM_and_BUM.md)
- [Trading paths](../02_Reference_Architecture/03_Trading_Paths.md)
- [A/B feeds fail together](../../01_Multicast/16_Practical_Cases/07_AB_Feeds_Fail_Together.md)

---
