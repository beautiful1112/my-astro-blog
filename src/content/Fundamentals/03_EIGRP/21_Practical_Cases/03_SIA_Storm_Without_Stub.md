# Case: SIA storm without stub

## Topology

```text
200 DMVPN spokes, none configured as stub
Hub Dual (H1/H2) in AS 100
One spoke LAN flaps: 10.50.50.0/24 on Spoke-50
```

## Symptom

After a single spoke access switch reboot, WAN control plane melts: hubs CPU high, many neighbors reset, syslog flooded with SIA. Sites far from Spoke-50 lose unrelated prefixes temporarily.

## Evidence

```text
! Hub
show ip eigrp topology active
! 10.50.50.0/24 ACTIVE, queries outstanding to dozens of spokes
show logging | include Stuck|SIA
show processes cpu sorted | include EIGRP
show ip eigrp neighbors detail | include stub
! no stub flags on spokes
```

Event log shows queries waiting on spoke routers that are slow or congested.

## Root cause

Without **EIGRP stub**, the hub queries *all* spokes for the flapping prefix. Lossy/CPU-busy spokes fail to reply in time → **SIA** → neighbor resets → more Active → storm.

## Fix

```text
! every spoke
router eigrp 100
 eigrp stub connected summary
!
! hub toward spokes
interface Tunnel0
 ip summary-address eigrp 100 0.0.0.0 0.0.0.0
```

Optional: repair QoS so replies/hellos are protected. Do **not** “fix” by only raising `timers active-time`.

Verify under controlled flap in maintenance:

```text
show ip eigrp topology active
! should clear quickly; spokes not widely queried
show ip eigrp neighbors detail
! stub peer
```

## Interview takeaway

“SIA storms on hub-spoke almost always mean missing stubs (and often missing summaries)—timers are not the first fix.”

## Related

- [Active and SIA](../20_Troubleshooting/06_Active_and_SIA.md)
- [Stub and Summary Together](../18_Scale_and_Design/03_Stub_and_Summary_Together.md)
- [DMVPN Spoke Query Problems](10_DMVPN_Spoke_Query_Problems.md)

---
