# L2 failure domains

An L2 domain shares **flooding, MAC learning, ARP/ND, and often a single control fate** (STP root, vPC keepalive, one VLAN stretch). Design it as a **blast radius**, not as “VLANs are free.”

## What shares fate

```text
VLAN 100 stretched Bldg-A ================= Bldg-B
         broadcast / loop / flapping MAC
         takes BOTH buildings + maybe DC if trunked
```

| Fault | Small closet domain | Stretched campus/DC domain |
|---|---|---|
| Loop | 1 access stack | Entire VLAN footprint |
| Broadcast storm | Local | WAN/DC uplinks melt |
| MAC flap | Local | Evictions everywhere |
| STP reconverge | Seconds local | Wide freeze |

## Sizing habit (defaults — override with R/C/A)

| Domain | Typical bound | Stretch? |
|---|---|---|
| Access closet | 1–2 switches, local VLANs | No |
| Building | Summarize at distribution | User VLANs: no between buildings |
| Campus | L3 between buildings | Only with a named requirement |
| DC leaf pair | VNI/VLAN local to pair or pod | Not to second DC by default |
| DCI | L3 | L2 only for isolated, named apps |

## Real-world — university that stretched “for roaming”

**Wanted:** Seamless Wi-Fi roaming across three buildings with one big user VLAN and one DHCP scope.

**What happened:** Rogue AP / loop in dorm switch → broadcast hit lecture halls and the data center edge where the VLAN was trunked for “convenience.” Wireless controllers overloaded; registration week outage.

**Repair:**

1. Per-building user VLANs + DHCP relays; same SSID with controller-based roaming or L3 roam.
2. No user VLAN on DC trunks.
3. BPDU guard / storm control on access.
4. Guest SSID → local DIA VRF, never campus user VLAN.

**Requirement rewrite:** “Roaming” was a preference. The real requirement was “students stay associated.” That does **not** require one flood domain.

## Real-world — VMware cluster “needs L2” between DCs

**Claim:** vMotion / cluster heartbeats need stretched VLAN.

**Design process:**

1. Ask which **exact** cluster services need L2 (many modern designs work with L3 + correct cluster config).
2. If L2 remains mandatory, put it in a **dedicated VNI/VLAN** with storm controls, not the whole tenant LAN.
3. Accept written residual risk: both DCs share fate for that segment → conflicts with “independent DC” RTO unless RTO is downgraded.

```text
DC-A leaf-spine          DC-B leaf-spine
   tenant VRFs L3 DCI ====== L3 DCI
   VNI 9001 (cluster only) -- tightly controlled stretch -- VNI 9001
   NOT VNI 100-500 user/app
```

## Design checklist

1. List every VLAN/VNI and its **maximum** geographic footprint.
2. For each stretch, write the requirement ID that forces it.
3. Confirm trunks do not casually allow that VLAN onto core/DC.
4. Name the control plane (STP/vPC/EVPN) and its fate domain.
5. Test: induce a storm in a closet lab — where do counters rise?

## Risks

- “Temporary” stretch that becomes permanent.
- VLAN 1 / native VLAN as production transit.
- MLAG pair stretched across buildings on a skinny peer-link.

## Interview framing

“I size L2 to the smallest set of ports that actually need the same flood domain. Stretching a VLAN is an explicit risk purchase with a requirement ID—not a convenience.”

## Related

- [STP and why to minimize L2](02_STP_and_Why_to_Minimize_L2.md)
- [L2 versus L3 at the access](04_L2_vs_L3_Access.md)
- [Case: campus L2 explosion](../19_Practical_Cases/01_Campus_L2_Explosion.md)
- [DCI patterns](../14_Data_Center_and_Cloud/03_DCI_Patterns.md)

---
