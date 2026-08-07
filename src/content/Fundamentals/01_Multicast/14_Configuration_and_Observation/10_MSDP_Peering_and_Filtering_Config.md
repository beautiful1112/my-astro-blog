# MSDP peering and SA-filter configuration

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

The example peers RP-A unique address `10.255.1.1` with RP-B `10.255.1.2`. Both may also own Anycast RP address `10.255.0.1`. Use unique addresses—not the anycast address—for the MSDP session.

## Cisco IOS-like skeleton

```text
ip msdp originator-id Loopback1
ip msdp peer 10.255.1.2 connect-source Loopback1

! Apply explicit source/group filters using the platform-supported ACL/route-map form.
ip msdp sa-filter in 10.255.1.2 route-map MSDP-SA-IN
ip msdp sa-filter out 10.255.1.2 route-map MSDP-SA-OUT
```

The filter should permit only approved source prefixes and ASM group ranges, then deny everything else. Test the exact route-map match semantics on the target release; MSDP policies can match source, group, and RP/originator through platform-specific constructs.

## Junos-like skeleton

```text
set protocols msdp local-address 10.255.1.1
set protocols msdp peer 10.255.1.2 local-address 10.255.1.1
set protocols msdp peer 10.255.1.2 import MSDP-SA-IN
set protocols msdp peer 10.255.1.2 export MSDP-SA-OUT
```

Junos routing policy can match the multicast group with `route-filter` and source with `source-address-filter`. Define explicit accept terms and a final reject.

## Session protection

Where supported and operationally justified:

- authenticate the TCP session;
- permit TCP/639 only between configured unique addresses;
- use stable loopbacks and controlled routing;
- apply active-source limits and warning thresholds;
- set CoPP without blocking legitimate SA churn;
- log session resets and SA filter rejects at a sustainable rate.

Changing authentication generally resets the TCP session; include that in change planning.

## Peer-RPF design

For more than two peers, document whether the topology uses:

- standard peer-RPF based on BGP/IGP route to originating RP;
- a consistently configured full mesh/mesh group; or
- a tightly controlled default peer for a stub domain.

Do not use a default peer merely to make rejected SAs disappear; it deliberately bypasses a loop-prevention check.

## Verification

```text
show ip msdp peer
show ip msdp sa-cache
show msdp
show msdp source-active
test msdp rpf-peer <originating-rp>
```

For one test `(S,G)` prove:

1. source registered at local RP;
2. local RP originated SA;
3. outbound filter permitted it;
4. remote peer received and peer-RPF accepted it;
5. inbound filter permitted it;
6. remote RP cached/processed it;
7. local receiver interest triggered PIM `(S,G)` Join;
8. native data—not MSDP—crossed the network.

## Negative tests

- unauthorized source in an allowed group;
- authorized source in a denied group;
- forged/unexpected RP originator;
- SA above active-source limit;
- BGP path change altering peer-RPF;
- TCP session up but import policy denying every SA;
- Anycast route healthy while MSDP synchronization is broken.
