# Metric Memory Card

## Classic (default Ks)

- K1=1, K3=1; others 0.
- **Bandwidth term:** from **minimum** interface bandwidth along path.
- **Delay term:** **sum** of delays along path.
- Interface delay unit historically **tens of microseconds** in classic scaling formulas.
- Changing interface `delay` is the common TE knob; `bandwidth` also moves metric and affects other features.

## Mental formula (classic scaled, defaults)

Remember the shape:

`metric ≈ 256 * ( (10^7 / min_BW_kbps) + sum_delay_tens_of_us )`

(Exact textbook constant form—drill one numeric example end-to-end in Module 07.)

## Wide metrics

- 64-bit path metrics; better differentiation on high-speed links.
- Throughput/latency style components; RIB may display scaled feed values.
- Migrate carefully across a domain—mixed understanding causes ops confusion.

## K mismatch

- **No adjacency.** Do not troubleshoot “metrics” first if neighbors are down.

## Not in default composite

- Reliability, load (need Ks); MTU not part of classic composite calculation.

## Pacing vs metric

- `bandwidth` → metric (and more).
- `ip bandwidth-percent eigrp` → **control-plane pacing** only.

---
