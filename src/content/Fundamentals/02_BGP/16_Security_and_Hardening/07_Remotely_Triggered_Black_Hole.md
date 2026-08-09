# Remotely Triggered Black Hole

**RTBH** uses a BGP signal—often the RFC 7999 **BLACKHOLE** community (`65535:666`)—to install **destination discard** forwarding near network ingress during a DDoS attack. Traffic to the victim prefix is dropped early, protecting downstream links and scrubbers’ capacity tradeoffs.

## Modes

| Mode | Effect |
|---|---|
| Destination RTBH | Discard packets **to** attacked address |
| Source RTBH (S/RTBH) | Discard packets **from** attack sources (uRPF-dependent; more dangerous) |

Most operators start with destination RTBH only.

## Safety controls

- Accept only authorized **host** or narrowly scoped prefixes.
- Verify the prefix belongs to the customer / your AS.
- Restrict who may attach BLACKHOLE / local RTBH communities.
- Set **NO_EXPORT** or a defined scope so the signal does not escape unexpectedly.
- Log, expire, and audit activations.
- Prefer a dedicated discard NH (`192.0.2.1` / Null0 / `discard` next-hop) with hardware drop.

## Configuration pattern

### Trigger router (customer edge / SOC)

```text
route-map RTBH permit 10
 set community 65535:666
 set ip next-hop 192.0.2.1
router bgp 65000
 network 203.0.113.8 mask 255.255.255.255 route-map RTBH
```

### Ingress PE / border (receiver)

```text
ip route 192.0.2.1 255.255.255.255 Null0
ip community-list standard BLACKHOLE permit 65535:666
route-map RTBH-IN permit 10
 match community BLACKHOLE
 set ip next-hop 192.0.2.1
```

### Junos

```text
set policy-options community BLACKHOLE members blackhole
set policy-options policy-statement RTBH-IN term 1 from community BLACKHOLE
set policy-options policy-statement RTBH-IN term 1 then next-hop discard
```

## RTBH vs FlowSpec

| | RTBH | FlowSpec |
|---|---|---|
| Match | Destination prefix (typically) | 5-tuple / DSCP / fragment, etc. |
| Action | Discard (common) | Drop, rate-limit, redirect |
| Safety | Simpler | Richer, easier to misconfigure |
| Scale | Very fast, blunt | Needs careful validation |

## Interactions

| Mechanism | Relationship |
|---|---|
| **FlowSpec** | More selective mitigation—[20/01](../20_Advanced_Families/01_BGP_FlowSpec.md) |
| **RPKI** | RTBH host routes may be Invalid if ROA maxLength too tight |
| **Max-prefix** | RTBH VRFs sometimes separated from Internet table |
| **NO_EXPORT** | Keeps blackhole signal on-net |

## Verification

```text
show bgp ipv4 unicast 203.0.113.8/32
show ip route 203.0.113.8
! next hop Null0 / discard
```

## Interview framing

“RTBH signals a discard next hop via BGP (often BLACKHOLE community) so borders drop attack traffic early; tightly filter who can trigger it—FlowSpec is the more selective alternative.”

---
