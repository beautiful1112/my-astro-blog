# Adj-RIB-In, Loc-RIB, and Adj-RIB-Out

RFC 4271 describes three conceptual Routing Information Bases:

- **Adj-RIB-In** — routes learned from each peer, as input to the local decision process;
- **Loc-RIB** — routes selected by the local BGP speaker after policy and best-path processing;
- **Adj-RIB-Out** — routes selected and transformed for advertisement to a specific peer.

These are **conceptual**. An implementation need not store three literal full copies. CLI labels such as “received-routes,” “routes,” and “advertised-routes” must be mapped to the platform’s storage model (pre-policy vs post-policy, soft-reconfiguration present or not).

## Pipeline mapping

```text
Peer UPDATE
  -> Adj-RIB-In (pre-policy if stored; else post-policy only)
  -> import policy
  -> Decision process
  -> Loc-RIB
  -> export policy (per neighbor)
  -> Adj-RIB-Out
  -> UPDATE to peer
```

Related: [Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md), [Soft reconfiguration versus Refresh](05_Soft_Reconfiguration_vs_Refresh.md), [Path vector and policy](../02_Fundamentals/03_Path_Vector_and_Policy.md).

## CLI translation (typical)

| Concept | Cisco-ish | Junos-ish |
|---|---|---|
| Adj-RIB-In pre-policy | `received-routes` with soft-reconfig | `receive-protocol` (post-policy nuances apply) |
| Post-policy / eligible | `show ip bgp` paths | `show route protocol bgp` |
| Loc-RIB best | `>` best path | `*[BGP/...]` active |
| Adj-RIB-Out | `advertised-routes` | `advertising-protocol` |

Always validate against your OS—names and pre/post-policy behavior differ.

## Configuration patterns (make Adj-RIB-In inspectable)

### Cisco IOS / IOS XE

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 198.51.100.1 soft-reconfiguration inbound
  neighbor 198.51.100.1 activate
```

### Junos

```text
set protocols bgp group EXT neighbor 198.51.100.1
# prefer show route receive-protocol / advertising-protocol
# keep keep all / rib groups designs documented when used
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 198.51.100.1 soft-reconfiguration inbound
  neighbor 198.51.100.1 activate
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Import policy | Transforms Adj-RIB-In view into eligible candidates |
| Best-path | Selects Loc-RIB entry among eligible |
| Export / split horizon | Constrains Adj-RIB-Out independently of Loc-RIB |
| RR | Changes which Loc-RIB paths may enter Adj-RIB-Out toward clients |

## Verification

```text
show ip bgp neighbors 198.51.100.1 received-routes
show ip bgp 203.0.113.0/24
show ip bgp neighbors 192.0.2.2 advertised-routes
show route receive-protocol bgp 198.51.100.1
show route advertising-protocol bgp 192.0.2.2
```

Lab checks:

1. Deny in import: Loc-RIB empty for prefix; pre-policy received-routes still shows it (with soft-reconfig).
2. Deny in export: Loc-RIB has best; advertised-routes empty to that peer.
3. Map one NLRI through all three conceptual RIBs on paper from real CLI output.

## Risks

- Saying “peer didn’t send it” when you only looked at post-policy tables.
- Assuming Loc-RIB equals FIB install.
- Memory exhaustion from unnecessary soft-reconfiguration on full tables.

## Interview framing

“Adj-RIB-In is what we learned from a peer, Loc-RIB is what we selected locally, Adj-RIB-Out is what we advertise to a peer—conceptual stores that map imperfectly to vendor CLI and may be pre- or post-policy.”

---
