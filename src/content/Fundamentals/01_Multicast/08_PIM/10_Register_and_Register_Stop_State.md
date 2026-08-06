# PIM Register and Register-Stop state

PIM Register messages solve ASM source discovery. The source-side DR (FHR) unicasts initial source packets to the RP, allowing the RP to learn `(S,G)` even when no native multicast tree yet connects them.

## Data Register format and path

A Register is an outer unicast IP packet with PIM protocol 103. Its PIM header is followed by a Register header and the original multicast IP packet.

```text
Outer IP: FHR unicast -> RP unicast, protocol 103
PIM Register header: Border bit, Null-Register bit
Inner IP: source S -> multicast group G, original payload
```

Intermediate routers need only unicast reachability to the RP. They do not decapsulate the packet or require `(S,G)` state.

The RP verifies that it is responsible for `G`, applies Register policy, evaluates source reachability, and may decapsulate and forward the inner packet onto the RPT. A malformed or unauthorized Register should be dropped without creating uncontrolled state.

## RP behavior

| Condition | Typical RP action |
|---|---|
| interested `(*,G)` receivers exist | decapsulate, forward on RPT, and join `(S,G)` toward source |
| no downstream interest | send Register-Stop; native tree is unnecessary |
| native `(S,G)` traffic arrives | send Register-Stop and use native traffic |
| source/group denied or wrong RP | reject and commonly send Register-Stop |

The RP may keep registration running, but native forwarding is normally preferred for throughput and path efficiency.

## FHR register state machine

Conceptually, each active `(S,G)` at the DR moves through:

1. **Join/Register:** send data Registers to the RP.
2. **Register-Prune:** after a valid Register-Stop, suppress full Registers for a randomized interval around the Register suppression time.
3. **Join-Pending:** shortly before suppression expires, send a Null-Register probe and wait briefly.
4. If a Register-Stop returns, restart suppression; otherwise resume data Registers.

The RFC default Register suppression time is 60 seconds and probe time is 5 seconds, but actual timers and display names vary.

## Null-Registers

A Null-Register sets the N bit and carries only enough of the inner IP header to identify `(S,G)`—not application payload. It tests whether the RP still has native state or still wants registration suppressed.

This periodic probe is essential recovery behavior. If the original RP fails and routing reaches another RP, or the RP loses source state, lack of Register-Stop causes full registration to resume.

## Border bit

The B bit historically marked a packet received from a PIM multicast border router. The revised PIM-SM specification removed the older PMBR functionality because it lacked deployment experience. Do not build a modern design around obsolete `(*,*,RP)`/PMBR behavior merely because a decoder still labels the bit.

## Failure patterns

| Symptom | Check |
|---|---|
| no Registers at RP | source-LAN DR, FHR RPF for `S`, RP mapping, unicast path, ACL/CoPP |
| Register reaches RP but no RPT data | RP mapping/policy, `(*,G)` OIL, decapsulation/forwarding counters |
| full Registers never stop | RP `(S,G)` Join, source RPF, native arrival, Register-Stop return path |
| source works only every suppression interval | Null-Register or Register-Stop loss, RP state instability |
| existing flow survives but new source fails | RP/registration plane failure hidden by established SPTs |
| RP CPU high | excessive source churn/rate, lack of native transition, attack, punt path limitations |

Capture both outer and inner headers. The outer source identifies the registering DR; the inner source identifies the actual multicast source.
