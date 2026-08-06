# PIM message formats and capture decoding

PIM version 2 messages share a four-byte header:

```text
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |PIM Ver| Type  |   Reserved    |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

`PIM Ver` is 2. The Type determines the rest of the message.

| Type | Message | Normal scope/path | Main fields to decode |
|---:|---|---|---|
| 0 | Hello | link-local all-PIM-routers | TLV options: Holdtime, DR Priority, GenID, LAN delay |
| 1 | Register | unicast FHR to RP | B/N bits and encapsulated multicast header/payload |
| 2 | Register-Stop | unicast RP to FHR | group and source |
| 3 | Join/Prune | link-local, names upstream neighbor | Holdtime, group sets, joined/pruned encoded sources |
| 4 | Bootstrap | hop-by-hop/flooded in PIM domain | BSR address/priority, hash mask, RP-set fragments |
| 5 | Assert | link-local on contested LAN | group, source, RPT bit, metric preference, route metric |
| 8 | Candidate-RP-Advertisement | unicast candidate RP to BSR | RP priority/holdtime and group prefixes |

Other assigned types exist for mechanisms such as Graft/Graft-Ack in PIM-DM and DF election in BIDIR-PIM. Always decode in the context of the configured PIM mode.

## Encoded addresses

PIM carries address-family and encoding metadata before unicast, group, and source addresses. Encoded group addresses include a mask length. Encoded source addresses also include:

- `S`: sparse bit;
- `W`: wildcard bit; and
- `R`: RPT bit.

For PIM-SM Join/Prune decoding, the important combinations are source-only `(S,G)`, wildcard+RPT `(*,G)`, and source+RPT `(S,G,rpt)`.

## Checksum caveat

For most PIM messages the checksum covers the complete PIM message. For Register messages it normally covers only the first eight bytes: the fixed PIM header and Register header, excluding the encapsulated data packet. For interoperability, RFC 7761 also requires acceptance of a valid checksum calculated over the complete Register message. Packet analyzers can report false checksum errors when capture offload is involved; corroborate with the receiving router's counters.

## Capture workflow

1. Verify IP version, protocol 103, source, destination, TTL/Hop Limit, and ingress link.
2. Decode PIM version and type.
3. For Hello, compare options and Holdtime across every neighbor.
4. For Join/Prune, confirm the named upstream neighbor and interpret source flags before deciding the state type.
5. For Register, inspect both outer FHR/RP addresses and inner `(S,G)`.
6. For Assert, compare the RPT bit and complete preference/metric/address election tuple.
7. For Bootstrap, follow the fragment tag and collect the complete RP-set; one packet may not contain it all.
8. Correlate the packet with the receiver's state change. A valid packet on the wire does not prove the control process accepted it.

Useful Wireshark display filters include `pim`, `pim.type == 0`, `pim.type == 1`, `pim.type == 3`, and `pim.type == 5` (field availability depends on version).
