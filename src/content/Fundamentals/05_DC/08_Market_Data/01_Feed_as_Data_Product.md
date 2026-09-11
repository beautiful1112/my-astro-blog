# Feed as a data product

Identify every feed by VRF, source, group, channel, and sequence domain. Network redundancy is useful only when the subscriber can distinguish and reconcile A/B data.

| Identity field | Why it exists |
|---|---|
| VRF | Tenant isolation; trading vs production consumers |
| Source IP | SSM (S,G); publisher identity |
| Group + feed ID | Channel identity |
| A/B sequence domain | Arbitration and loss detection |

A “redundant multicast” that lands on one NIC as two indistinguishable streams is not two products. It is one product with a harder debugging story.

Protocol and trading depth: [quantitative-trading market data](../../01_Multicast/12_Quant_Trading_Market_Data/README.md).

## Related

- [A/B independence](02_AB_Independence.md)
- [Trading paths](../02_Reference_Architecture/03_Trading_Paths.md)
- [A/B line arbitration](../../01_Multicast/12_Quant_Trading_Market_Data/03_AB_Line_Arbitration.md)

---
