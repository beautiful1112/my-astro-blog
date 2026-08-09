# RPKI-to-Router Protocol and Validator Design

The **RPKI-to-Router (RTR)** protocol lets a router retrieve validated prefix-origin data from a **cache**. The cache synchronizes repositories and performs cryptography; the router performs fast route-to-VRP comparison.

## Architecture

```text
Repositories (RIR/NIR/RI) 
        ↓
 Validator / RP software (Routinator, rpki-client, OctoRPKI, …)
        ↓  RTR (TCP 323 / TLS variants)
 Routers (one or more)
```

## Design requirements

| Requirement | Why |
|---|---|
| ≥2 independent validators | Cache failure must not strand ROV |
| Diverse hosting / networks | Avoid shared fate with one transit |
| Monitoring of sync age | Reachable ≠ fresh |
| Serial / incremental updates | Large VRP churn handling |
| Stale-cache policy | What routers do if RTR dies |
| Auth / protected mgmt path | Prevent VRP tampering on path to cache |

## Router behavior on cache loss

Platforms differ: keep last VRP set, mark all NotFound, or freeze validation. **Document and test** expiry behavior before enforcing Invalid drops.

## Configuration sketches

### Cisco IOS XR

```text
router bgp 65000
 rpki server 192.0.2.10
  transport tcp port 323
  refresh-time 600
```

### Junos

```text
set routing-options validation group RPKI session 192.0.2.10
set protocols bgp group EBGP family inet unicast validation
```

### FRR

```text
rpki
 cache 192.0.2.10 323 preference 1
 cache 192.0.2.11 323 preference 2
exit
router bgp 65000
 address-family ipv4 unicast
  neighbor 203.0.113.1 route-map RPKI-IN in
```

## Alerting

- Large sudden VRP count drops (repository or TAL failure).
- RTR session flaps.
- Spike in Invalid routes after a ROA change window.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Origin policy** | Consumes VRP-derived states |
| **IRR filters** | Parallel authorization source—do not abandon overnight |
| **BMP** | Observe validation state changes centrally |

## Verification

```text
show bgp rpki servers
show bgp rpki table | count
show rpki cache-server  # vendor-specific
```

## Interview framing

“RTR feeds VRPs from validators to routers so the router does not crawl RPKI repositories; design redundant caches and define behavior when the cache goes stale.”

---
