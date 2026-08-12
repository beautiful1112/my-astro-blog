# VLAN and broadcast design

VLANs are **broadcast and policy containers**, not org-chart decorations. Too many VLANs without an address plan creates ops noise; too few creates huge flood domains.

## Rules of thumb (always subordinate to R/C/A)

- One VLAN ≈ one subnet ≈ one security/broadcast intent.
- Do not stretch user VLANs between buildings without a named requirement.
- Data, voice, wireless, and IoT usually **separate** for QoS and security—not because “Cisco said 3 VLANs in 2004,” but because their contracts differ.
- Prune trunks; unused VLANs on a trunk enlarge the failure domain.

```text
Bldg A
  VLAN 10 data  10.10.0.0/22
  VLAN 20 voice 10.20.0.0/23
  VLAN 30 iot   10.30.0.0/23   -- no L3 to PCI / no stretch to Bldg B
```

## Mapping to L3

VLAN count should match **summarizable** addressing so distribution can hide topology. Random VLAN IDs per app team without an IP plan is how summarization dies.

## Interview framing

“A VLAN is a blast radius and a policy bucket. I create one when the broadcast or security contract is different, and I refuse to stretch it without a written requirement.”

---
