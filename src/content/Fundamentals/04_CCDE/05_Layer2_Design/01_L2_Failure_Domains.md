# L2 failure domains

An L2 domain shares **flooding, MAC learning, and often a single control fate** (STP, vPC keepalive, one VLAN stretch). Design it as a blast radius, not as “VLANs are free.”

## What shares fate

```text
VLAN 100 stretched Bldg-A --------------- Bldg-B
         loop / broadcast / flapping MAC
         takes both buildings
```

Faults that stay inside one access closet are cheap. Faults that ride a stretched VLAN into the DC are expensive.

## Sizing habit

| Domain | Typical bound |
|---|---|
| Access closet | One or two switches, local VLANs |
| Building | Summarize at distribution; do not stretch user VLANs between buildings |
| DC | VLAN local to a pair/leaf pair unless a **stated** L2 adjacency requirement exists |
| DCI | Default **no** L2 stretch; if required, isolate and constrain |

A requirement like “VM vMotion between DCs” is a real L2-ish need—meet it with a **controlled** construct (EVPN, dedicated stretch) and accept the fate, or challenge the requirement.

## Interview framing

“I size L2 to the smallest set of ports that actually need to be in the same flood domain. Stretching a VLAN is an explicit risk purchase.”

---
