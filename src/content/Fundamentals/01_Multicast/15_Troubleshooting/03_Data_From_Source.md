# Follow data from source downstream

When control state looks healthy, trace **packets** from the source toward the receiver. The first observation boundary where the sequence disappears identifies the failure domain.

1. Verify `(S,G,port)`, egress interface, TTL, and packet size at the source.
2. Confirm the FHR sees traffic and it passes RPF.
3. For ASM, verify Registers at the correct RP.
4. At every branch, compare mroute input and replicated output counters.
5. Confirm hardware matches the control-plane OIL.
6. Verify last-hop switch delivery, NIC receipt, socket queue, and application consumption.

Related: [Control from receiver](02_Control_State_From_Receiver.md), [Packet capture](05_Packet_Capture.md), [RPF failure case](../16_Practical_Cases/03_RPF_Failure_After_Route_Change.md).

## Downstream ladder

```text
Source sendto (TTL, if, size)
  -> FHR accept + RPF
    -> Register or native (S,G) forward
      -> each hop IIF counter ++ / OIL replicate
        -> last-hop switch flood to member ports
          -> NIC / socket / app sequence
```

## Configuration patterns (show / capture)

### At source host

```text
tcpdump -ni eth0 -vv 'udp and dst host 232.10.10.10 and dst port 15000'
ip route get 232.10.10.10
# Confirm IP_MULTICAST_IF and TTL
```

### Cisco path

```text
show ip mroute 192.0.2.10 232.10.10.10 count
show ip rpf 192.0.2.10
show ip pim tunnel   ! Registers when ASM
show interfaces <iif> counters
show interfaces <oif> counters
# Compare hardware
show ip mfib 192.0.2.10 232.10.10.10
```

### Junos

```text
show pim source detail
show multicast route extensive
show interfaces <if> extensive | match pps
```

### Span / TAP

```text
tcpdump -ni eth1 -tt 'udp and src host 192.0.2.10 and dst host 232.10.10.10'
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **TTL** | Decrements per hop; too low looks like “network drop” ([case](../16_Practical_Cases/09_TTL_Confusion.md)) |
| **Boundary ACL** | OIL present in control, silent data drop |
| **Host path** | Wire OK, app gaps ([case](../16_Practical_Cases/06_Capture_Sees_Data_Application_Gaps.md)) |

## Verification checklist

- [ ] Source rate and TTL match design  
- [ ] FHR RPF OK; counters increment  
- [ ] ASM: Register/native transition understood  
- [ ] Each OIL member increments under traffic  
- [ ] MFIB/hardware matches TIB  
- [ ] Receiver NIC sequences continuous before app  

## Risks

- Clearing mroutes while collecting counts.
- Trusting software mroute without MFIB programming.
- Skipping the host after “tcpdump on the switch looks fine.”

## Interview framing

“Trace sequenced data hop by hop from source—RPF, Registers if ASM, per-OIL counters, hardware OIL, then NIC and socket—and stop at the first boundary that loses the sequence.”

---
