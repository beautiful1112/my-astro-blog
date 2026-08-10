# Interview questions: trading and performance

## Question

Why do exchanges use UDP multicast instead of TCP? How do A/B feeds help? How do you locate a sequence gap? Why is average bandwidth insufficient? Can a larger buffer hurt? Why avoid IP fragmentation for market data?

## Strong answer

- **UDP multicast:** One-to-many delivery without per-receiver sender state or TCP head-of-line blocking; the firm owns loss detection and recovery.
- **A/B feeds:** Earliest-copy arbitration fills path-specific gaps when lines are in **independent** failure domains; same switch/NIC is not diversity.
- **Locate a gap:** Compare the same sequence at ordered, time-synchronized observation points (TAP, switch, NIC, socket, app) and correlate drop counters at the first break.
- **Average bandwidth:** Small packets and microbursts exhaust pps, queues, and CPU while averages look fine; replication multiplies egress.
- **Larger buffer:** Can replace visible loss with stale-data latency—bad for trading even if gap counters fall.
- **Fragmentation:** One missing fragment loses the datagram; reassembly adds state and latency; size under true path MTU.

## Follow-ups

- What metrics separate loss from staleness?
- How do you prove A/B independence?
- LAG 4×10G for a 15G `(S,G)`—safe?

## Cross-links

[Why exchanges use multicast](../12_Quant_Trading_Market_Data/01_Why_Exchanges_Use_Multicast.md), [A/B arbitration](../12_Quant_Trading_Market_Data/03_AB_Line_Arbitration.md), [Loss vs latency](../12_Quant_Trading_Market_Data/04_Loss_vs_Latency.md), [Capacity math](../12_Quant_Trading_Market_Data/05_Capacity_Math.md), [LAG/ECMP](../12_Quant_Trading_Market_Data/07_LAG_and_ECMP.md).

---
