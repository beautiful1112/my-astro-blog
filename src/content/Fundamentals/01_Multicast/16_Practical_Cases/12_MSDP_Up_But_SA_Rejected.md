# Case 12: MSDP session is up but Source-Active messages are rejected

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Symptom

MSDP peer state is Established and keepalives succeed. Sources in the remote domain never appear in the local SA cache, so a local ASM receiver builds `(*,G)` to its RP but receives no remote-source traffic.

## Trigger

A BGP/IGP path change alters the expected peer-RPF path toward the originating RP. The SA arrives from MSDP peer P1, but the routing information says P2 is the correct peer toward that originator. MSDP discards the SA to prevent a loop.

## Evidence

```text
MSDP P1: Established
SA received counter: increasing
SA accepted counter: unchanged
reject reason: peer-RPF / wrong peer
test rpf-peer <originating-RP>: P2
```

The TCP session and packet capture prove delivery to the MSDP process; they do not prove acceptance.

## Investigation

1. identify the SA originator RP—not only `S`;
2. inspect the route/BGP path used by the peer-RPF algorithm;
3. identify the expected RPF peer;
4. check mesh-group membership consistency;
5. inspect default-peer use and SA import policy;
6. confirm remote RP is originating the SA with the expected originator ID.

## Corrective options

- restore routing so SAs arrive from the expected peer;
- complete and consistently configure the intended MSDP mesh group;
- correct originator/next-hop policy;
- in a genuine stub with one trusted upstream, use a documented filtered default peer.

Do not configure a default peer simply to bypass every reject; it weakens loop prevention and trust boundaries.

## Validation

After correction, prove SA received **and accepted**, local `(*,G)` interest triggers `(S,G)` Join toward the remote source, and native data returns on the MRIB-selected path.
