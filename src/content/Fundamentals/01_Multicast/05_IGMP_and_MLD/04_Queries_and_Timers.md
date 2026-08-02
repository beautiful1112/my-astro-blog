# IGMP queries and timers

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Three query scopes

| Query | Group field | Sources | Purpose |
|---|---|---:|---|
| General | 0.0.0.0 | 0 | Refresh all listener state on the link |
| Group-Specific | G | 0 | Ask whether any listener still wants G |
| Group-and-Source-Specific | G | 1 or more | Ask whether listed sources are still wanted for G |

Only IGMPv3 supports the third form.

## Default protocol variables

| Variable | Symbol | Default | Meaning |
|---|---:|---:|---|
| Robustness Variable | RV | 2 | Expected loss tolerance |
| Query Interval | QI | 125 s | Interval between General Queries |
| Query Response Interval | QRI | 10 s | Maximum response window for General Query |
| Last Member Query Interval | LMQI | 1 s | Response window and spacing during leave check |
| Last Member Query Count | LMQC | RV = 2 | Number of last-member queries |
| IGMPv2 Unsolicited Report Interval | URI | 10 s | Maximum delay before repeated initial v2 report |
| IGMPv3 Unsolicited Report Interval | URI | 1 s | Maximum delay between v3 state-change retransmissions |

## Derived timers

| Timer | Formula | Default |
|---|---|---:|
| Group Membership Interval | `RV × QI + QRI` | 260 s |
| Other Querier Present Interval | `RV × QI + QRI / 2` | 255 s |
| Startup Query Interval | `QI / 4` | 31.25 s |
| Startup Query Count | `RV` | 2 |
| Last Member Query Time | `LMQI × LMQC` | 2 s |
| IGMPv3 Older Version Querier Present Timeout | `RV × QI + QRI` | 260 s |

IGMPv2 separately defines **Version 1 Router Present Timeout = 400 seconds**. Do not substitute the v3 formula when diagnosing a v2 host held in v1 compatibility mode.

## Host response timing

Hosts choose a random response delay within the query's advertised maximum. This spreads reports instead of creating a synchronized response burst.

- IGMPv1 has no encoded maximum; its fixed maximum delay is 10 seconds.
- IGMPv2 Max Resp Time is an 8-bit count of 0.1-second units.
- IGMPv3 Max Resp Code keeps direct 0.1-second encoding below 128 and uses floating encoding at 128 or above.

If a new query requests an earlier response than an already-running timer, the host shortens/reset the timer according to the version rules; a later deadline must not postpone an earlier pending response.

## Operational trade-off

Lowering QI or LMQI can reduce stale traffic, but raises report/query rate and sensitivity to packet loss, slow CPUs, control-plane policing, and snooping bugs. Tune the entire link consistently and verify the actual query fields in a capture.

