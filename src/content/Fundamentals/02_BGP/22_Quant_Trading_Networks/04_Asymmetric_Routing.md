# Asymmetric Routing in Trading Networks

BGP selects forward and reverse directions independently, so asymmetry is normal. It becomes harmful when stateful devices, uRPF, or latency budgets assume symmetry.

## When asymmetry hurts

- Stateful firewalls or NAT see only one direction.
- Order path is low-latency while return is long-haul.
- Strict uRPF drops the return flow.
- Troubleshooting observes only the client→venue traceroute.
- Market-data multicast and unicast control share unexpected edges.

## Control levers (and limits)

| Direction | What you control | What you influence |
|---|---|---|
| Outbound (your AS → peer) | LOCAL_PREF, IGP/AIGP to exit, weight | — |
| Inbound (Internet → you) | AS prepend, MED (same neighbor AS), communities, more-specifics | Remote policy may ignore you |

Do not force symmetry unless the application or security architecture requires it. Prefer measuring both directions from relevant endpoints.

## Verification

```text
traceroute <venue>          # forward
# reverse: traceroute from venue/looking-glass to your VIP
show bgp ipv4 unicast <vip> # outbound exit
# Confirm inbound advertisement via looking glass / collector
```

## Trading example

Outbound orders exit Exchange-A (LP 300). Inbound market-data control stays on Provider-B because remote LP ignores your prepend. Application tolerates asymmetry; stateful risk firewall must see both directions or sit off-path.

If a firewall is on-path, either force symmetric routing for that flow class or move state off the asymmetric edge.

Document intentional asymmetry for VIP prefixes so on-call does not “fix” a working design during an incident.

## Ops note

Record the intended LOCAL_PREF / community class for each VIP in the same repo as the configs so on-call does not reverse-engineer intent from live attributes alone.

---
