# Interview: Design BGP for a Low-Latency Trading Site

## Question

What would you prioritize in a BGP design for a trading site?

## Strong answer

I would classify every peer and critical prefix, encode deterministic path intent with policy, measure both-direction latency/loss, preserve physically independent backups, combine tested fast detection with preinstalled repair, and monitor RIB/FIB plus service traffic. I would separate order, market-data, and bulk policy; protect sessions and origins; pre-stage DDoS actions; and test failure capacity. I would not use AS-path length alone as a latency metric.

---

