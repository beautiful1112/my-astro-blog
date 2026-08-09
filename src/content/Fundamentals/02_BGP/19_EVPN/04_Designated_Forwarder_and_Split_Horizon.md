# Designated Forwarder and Split Horizon

On a multihomed Ethernet segment, the **Designated Forwarder (DF)** controls which PE forwards selected traffic—especially **BUM**—from the EVPN core toward the CE segment. **Split-horizon** prevents traffic learned/received from that segment from being sent back to it through another PE.

## DF election (concept)

1. PEs sharing an ESI exchange **Type-4** Ethernet Segment routes.
2. For each Ethernet Tag (VLAN/BD) or ES-wide service, run the DF algorithm (modulo / preference / HRW variants per platform/RFC updates).
3. Non-DF PEs block BUM toward the CE on that service.
4. Unicast in all-active mode may still hash to multiple PEs via aliasing.

## Split horizon

```text
CE --LAG-- PE-A
       \-- PE-B

Frame from CE into PE-A must not return CE via PE-B
EVPN uses ESI-based SH filters / SH labels depending on data plane
```

Without SH: broadcast storms / echoes on the CE LAG. Without correct DF: duplicate BUM or blackholed BUM.

## What to inspect during BUM issues

| Check | Command / focus |
|---|---|
| ESI membership | Same ESI on intended PE ports only |
| Type-4 exchange | All MH PEs present |
| DF winner | Per VLAN/BD as expected |
| Preference knobs | Manual DF bias during maintenance |
| SH programming | Platform `show evpn` / forwarding ESI filters |

## Configuration notes

```text
! preference / DF election knobs are vendor-specific
evpn ethernet-segment
 df-election wait-time 3
! or preference-based DF
```

Drain traffic with graceful DF preference changes before PE maintenance when supported.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Type-3 IMET** | Builds BUM delivery *among PEs*; DF gates PE→CE BUM |
| **All-active vs single-active** | Changes unicast vs BUM responsibilities |
| **IGMP snooping / L2 MC** | Further constrains BUM inside BD |

## Verification

```text
show evpn ethernet-segment detail
! DF role per VLAN
show bridge-domain <bd> forwarding
! duplicate/missing BUM during lab failover
```

## Interview framing

“DF elects which multihomed PE forwards BUM to the CE; split-horizon stops ES traffic from hairpinning back through another PE—Type-4 and ESI programming are the control-plane inputs.”

---
