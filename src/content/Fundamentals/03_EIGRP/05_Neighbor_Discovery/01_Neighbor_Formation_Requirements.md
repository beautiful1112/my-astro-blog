# Neighbor formation requirements

An EIGRP **neighbor adjacency** forms only when Hellos are exchanged successfully and critical parameters match. Ping success is neither necessary in all designs nor sufficient. Treat adjacency as a checklist, not a mystery.

## Must-match / must-satisfy list

| Requirement | Notes |
|---|---|
| **Same AS number** | Process/AF AS identity |
| **Identical K-values** | Any K mismatch → no neighbor |
| **Same primary subnet** (IPv4) | Primary addresses must be in one subnet; secondaries do not form EIGRP neighbors |
| **Authentication** | If configured, must match (key/keychain) |
| **Compatible AF** | IPv4 AF peers with IPv4; IPv6 separate |
| **Common L2 / proto 88 path** | Multicast and/or unicast as design requires |
| **Not passive** | `passive-interface` blocks adjacency on that iface |
| **Timers sane** | Hold from peer must exceed Hello period |

Related: [AS number in EIGRP](../03_Process_and_Address_Families/01_AS_Number_in_EIGRP.md), [K-values and mismatch](../07_Metrics_and_K_Values/04_K_Values_and_Mismatch.md), [Common neighbor mismatches](07_Common_Neighbor_Mismatches.md).

## Mental model

```text
Shared segment
  -> Hellos (AS, K, Hold, auth)
  -> parameters OK?
        yes -> neighbor up -> Update exchange
        no  -> Hellos ignored / adjacency refused
```

## Configuration patterns

### Cisco IOS / IOS XE — classic

```text
key chain EIGRP-KEYS
 key 1
  key-string SECRET
!
interface GigabitEthernet0/0
 ip address 10.1.1.1 255.255.255.0
 ip authentication mode eigrp 100 md5
 ip authentication key-chain eigrp 100 EIGRP-KEYS
!
router eigrp 100
 network 10.1.1.0 0.0.0.255
 metric weights 0 1 0 1 0 0
```

Both sides need the same `metric weights` (K-values) and auth.

### Named mode

Place auth and timers under `af-interface`; AS under AF.

## Verification

```text
show ip eigrp neighbors
show ip eigrp interfaces detail
show ip protocols
show key chain
```

Lab: break one requirement at a time (AS, K, subnet, auth, passive); document exact symptom for each.

## Risks

- Secondary-only addressing expecting adjacency.
- Changing K-values on one router for “tuning.”
- Auth key rotation without overlap windows.

## Interview framing

“EIGRP neighbors require matching AS and K-values, same primary subnet, working proto-88 Hello path, and matching auth if used—passive-interface or any mismatch means no adjacency.”

---
