# PIM Hello, DR election, and LAN behavior

PIM Hellos establish per-interface neighbor state and advertise capabilities. They are sent periodically to the all-PIM-routers link-local group and are not forwarded beyond the link.

## Important Hello options

| Option | Why it matters |
|---|---|
| Holdtime | how long the receiver keeps this neighbor without another Hello |
| DR Priority | makes DR selection explicit when every neighbor supports it |
| Generation ID | random value changed after restart; lets neighbors detect lost state and refresh joins quickly |
| LAN Prune Delay | advertises propagation delay, override interval, and explicit-tracking capability |
| Address List | associates secondary addresses with the same PIM neighbor |

Unsupported optional fields should not destroy basic adjacency. A malformed message, incompatible address family, checksum error, ACL, TTL/Hop Limit problem, or mismatched interface activation can.

## Neighbor lifecycle

1. PIM is enabled and a router sends an immediate Hello.
2. A peer validates it and creates neighbor state with the advertised Holdtime.
3. Later Hellos refresh the timer and options.
4. A Hello with Holdtime zero removes the neighbor immediately; otherwise silence removes it on expiry.
5. A changed Generation ID means the neighbor probably restarted and lost tree state. Peers can send fresh Join/Prune state without waiting for normal refresh timers.

Neighbor formation does not negotiate PIM-SM versus SSM on the link. Group policy and address ranges determine how each group is treated.

## Designated Router election

On a LAN with multiple PIM routers, one DR represents local hosts.

```text
Source/receivers --- shared VLAN --- R1
                                \-- R2
```

When all known neighbors include DR Priority, compare priority first and choose the **highest numeric value**; use the highest primary address as tie-breaker. If any neighbor lacks the option, ignore priorities and elect the highest primary address.

The DR:

- registers directly connected ASM sources to the RP;
- initiates upstream trees for directly connected receiver interest; and
- may be the IGMP/MLD querier, but that is a separate election with different rules.

Changing DR priority can move this role without changing IGP paths. Plan for transient duplicate Registers, Join refresh, or packet loss during changeover.

## Join/Prune suppression and override

PIM Join/Prune messages name one upstream neighbor but are visible to every PIM router on a LAN. This permits coordination:

- if a router hears another router Join the same state, it may suppress its redundant Join for a bounded time;
- if it hears a Prune but still needs the traffic, it sends an overriding Join before the prune takes effect;
- LAN Prune Delay options let neighbors agree on suitable propagation and override intervals;
- explicit tracking, when supported by all relevant neighbors, can let the upstream router know each downstream neighbor and prune faster.

Packet loss or inconsistent LAN-delay capability can therefore affect convergence even while adjacency remains up.

## Three elections that are often confused

| Mechanism | Scope | Chooses | Trigger |
|---|---|---|---|
| IGMP/MLD querier | receiver subnet | router that sends membership queries | election/timeout based on membership protocol |
| PIM DR | PIM LAN | router acting for connected hosts | Hellos and DR priority/address |
| PIM Assert | one tree on one LAN | router allowed to forward that flow onto the LAN | duplicate multicast data |

They may select different routers. A healthy design must work when they do.

## Operational checks

- confirm every expected neighbor and its interface, address, uptime, expiry, GenID, and DR priority;
- compare the DR winner with the intended source/receiver gateway;
- verify secondary addresses are associated with the correct neighbor;
- look for repeated adjacency resets or changing Generation IDs;
- check that PIM control-plane ACLs allow protocol 103 and link-local destinations; and
- on a LAN issue, inspect Join/Prune suppression, override, and Assert state—not only Hello state.
