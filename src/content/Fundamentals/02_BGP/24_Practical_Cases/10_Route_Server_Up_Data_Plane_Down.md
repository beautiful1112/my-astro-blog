# Case: IXP Route-Server Session Up, Data Plane Down

## Symptom

The route server advertises a participant prefix, but packets to that prefix fail.

## Reasoning

The route server is not in the forwarding path. NEXT_HOP is the participant address, which is unresolved on the exchange LAN.

## Proof

BGP next-hop lookup points to the IXP interface, but ARP/ND fails or the participant VLAN/ACL is wrong.

## Correction

Repair bilateral layer-2 reachability, addressing, or filtering. Do not change the route-server next hop unless the design explicitly requires it.

## Lesson

Route-server control-plane success does not prove participant-to-participant forwarding.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
