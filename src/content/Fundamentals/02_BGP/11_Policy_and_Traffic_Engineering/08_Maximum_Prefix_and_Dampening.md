# Maximum-Prefix and Route-Flap Dampening

**Maximum-prefix** and **route-flap dampening** solve different problems. Operators often conflate them during incidents.

| Control | Protects against | Unit |
|---|---|---|
| Maximum-prefix | Too many routes from a peer (memory/CPU/leak) | Count of prefixes per neighbor/AF |
| Flap dampening | Repeated withdraw/advertise churn | Penalty per prefix over time |

## Maximum-prefix

Choose warning and shutdown thresholds from the **contracted table size + growth headroom**. Define restart behavior (manual, automatic after timer, or until clear).

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 192.0.2.1 maximum-prefix 1000 90 restart 5
 ! 1000 max, warn at 90%, restart after 5 minutes
```

### Junos

```text
set protocols bgp group PEERS family inet unicast prefix-limit maximum 1000
set protocols bgp group PEERS family inet unicast prefix-limit teardown 90 idle-timeout 5
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 192.0.2.1 maximum-prefix 1000
 exit-address-family
```

Always set **per address family** (v4/v6/VPN) limits. A peer can be fine on v4 and explode on v6.

## Route-flap dampening

Dampening assigns a penalty when a route flaps and suppresses it while the penalty exceeds a cutoff. Poor settings delay recovery after legitimate events and can amplify harm during widespread instability. Many operators disable classic Internet-edge dampening or use very conservative profiles.

### Cisco IOS / IOS XE (conceptual)

```text
router bgp 65000
 bgp dampening 15 750 2000 60
 ! half-life, reuse, suppress, max-suppress — tune with care or leave disabled
```

### Junos

```text
set protocols bgp damping
set policy-options damping MILD half-life 15 suppress 3000 reuse 750
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Policy bugs | Max-prefix may tear down a session that was “working” but mis-filtered |
| ORF | Reduces received count but is not a substitute for max-prefix |
| Soft-reconfig | Memory pressure compounds with high prefix counts |
| PIC / GR | Dampening can delay valid alternate paths after maintenance |

## Verification

```text
show ip bgp summary
show ip bgp neighbors 192.0.2.1
! Prefix count vs limit
show ip bgp dampened-paths
show bgp ipv4 unicast dampening parameters
```

Monitor **update rate** as well as prefix count—a peer below max-prefix can still generate damaging churn.

## Risks

- Copying another AS’s dampening profile without math.
- Max-prefix too tight on customer growth days → self-inflicted outage.
- Auto-restart flapping against a continuously leaking peer.
- Enabling dampening as a substitute for fixing unstable IGP or unstable CE.

## Interview framing

“Max-prefix bounds volume per peer; dampening penalizes flapping prefixes—use max-prefix universally, treat dampening as optional and carefully tuned, and monitor churn rate not just count.”

---
