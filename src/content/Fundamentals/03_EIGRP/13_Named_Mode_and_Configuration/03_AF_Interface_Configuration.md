# AF interface configuration

Under named mode, per-interface EIGRP behavior is configured in **`af-interface`** (or `af-interface default` for inheritance). This replaces many classic `interface` + `ip … eigrp <AS>` commands.

## Common knobs

| Knob | Purpose |
|---|---|
| `hello-interval` / `hold-time` | Neighbor timers |
| `authentication mode` / keys | MD5/SHA auth (platform) |
| `summary-address` | Outbound summary (+ leak-map) |
| `split-horizon` / `no split-horizon` | Multipoint hub reflection |
| `bandwidth-percent` | Cap EIGRP pacing bandwidth share |
| `passive-interface` | Suppress hellos (AF-aware forms) |

## Example

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface default
   passive-interface
  exit-af-interface
  af-interface GigabitEthernet0/0
   no passive-interface
   hello-interval 5
   hold-time 15
   summary-address 10.10.0.0/16
   bandwidth-percent 25
  exit-af-interface
  af-interface Tunnel0
   no split-horizon
  exit-af-interface
 exit-address-family
```

## Classic equivalents (memory map)

```text
af-interface X hello-interval 5
  ↔ ip hello-interval eigrp <AS> 5

af-interface X summary-address 10.10.0.0/16
  ↔ ip summary-address eigrp <AS> 10.10.0.0 255.255.0.0

af-interface X no split-horizon
  ↔ no ip split-horizon eigrp <AS>
```

## Verification

```text
show eigrp address-family ipv4 interfaces
show eigrp address-family ipv4 interfaces detail
show running-config | section router eigrp
```

## Risks

- Setting timers only under `af-interface default` then forgetting `no passive` on real links.
- Disabling split horizon globally via default instead of one tunnel.
- bandwidth-percent too low on low-bw WAN → slow convergence / RTP pacing issues.

## Interview framing

“af-interface is named-mode’s per-link policy pocket: timers, auth, summary, SH, bandwidth-percent.”

## Related

- [Named mode structure](01_Named_Mode_Structure.md)
- [Interface summarization](../10_Summarization/03_Interface_Summarization.md)
- [Split horizon](../11_Stub_Filtering_and_Split_Horizon/06_Split_Horizon.md)

---
