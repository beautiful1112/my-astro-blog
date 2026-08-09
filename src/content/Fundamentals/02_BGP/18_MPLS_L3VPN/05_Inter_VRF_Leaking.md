# Inter-VRF Route Leaking

**Inter-VRF leaking** makes prefixes from one VRF visible in another (shared services, extranet, Internet gateway VRF). It is powerful and easy to create loops or security bypasses.

## Common methods

| Method | Mechanism |
|---|---|
| **RT import** | VRF-B imports RT exported by VRF-A |
| **Policy-based leak** | Explicit `import/export` route-maps / `vrf import` policies |
| **Static / next-hop leak** | Point across VRFs (platform-specific) |
| **Global table ↔ VRF** | Internet access VRF patterns |

Prefer RT/policy leaks that remain visible in MP-BGP over opaque static hacks when multi-PE consistency matters.

## Shared services example

```text
VRF CUST-A  export RT 65000:10  import RT 65000:10 and 65000:1000
VRF CUST-B  export RT 65000:20  import RT 65000:20 and 65000:1000
VRF SHARED  export RT 65000:1000 import RT 65000:1000
```

Customers reach SHARED; SHARED should **not** necessarily import customer RTs (avoid becoming a transit hairpin) unless designed as a hub.

## Loop and security risks

- Mutual imports without filtering → routing loops or recursive NH failures.
- Leaking Internet defaults into many VRFs → unintended transit and blast radius.
- Overlapping address spaces between VRFs → ambiguous destinations; use NAT or non-overlap discipline.
- Leaking into an Internet VRF can expose private networks unless tightly filtered.

## Configuration sketches

### Cisco (RT)

```text
vrf definition SHARED
 rd 65000:1000
 route-target export 65000:1000
 route-target import 65000:1000
vrf definition CUST-A
 route-target import 65000:1000
```

### Junos (policy)

```text
set policy-options policy-statement LEAK-FROM-A term 1 from instance CUST-A
set policy-options policy-statement LEAK-FROM-A term 1 then accept
set routing-instances SHARED routing-options instance-import LEAK-FROM-A
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **SoO / AS tools** | Still needed for PE-CE loops—[08](08_PE_CE_AS_Loop_Toolkit.md) |
| **RTC** | Imported RTs increase RT interest set |
| **Firewall / VRF-aware FW** | Often required at leak points |
| **Local preference / MED** | Control which VRF path wins when duplicates exist |

## Verification

```text
show ip route vrf CUST-A
show ip route vrf SHARED
show bgp vpnv4 unicast vrf SHARED
! confirm only intended prefixes
```

Traceroute between VRFs should hit the designed service PE, not an accidental core loop.

## Interview framing

“Inter-VRF leaking is usually RT or policy import between VRFs for shared services; filter tightly—mutual leaks and default-route leaks are common loop and exposure failures.”

---
