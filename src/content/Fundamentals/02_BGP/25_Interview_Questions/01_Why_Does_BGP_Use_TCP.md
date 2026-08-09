# Interview: Why Does BGP Use TCP?

## Question

Why does BGP use TCP, and what does TCP not provide for BGP?

## Strong answer

BGP uses TCP port 179 for reliable, ordered byte-stream delivery and retransmission so the protocol can focus on routing state and policy rather than hop-by-hop reliability. TCP gives sequencing and retransmission; it does **not** validate prefix authorization, AS_PATH truthfulness, next-hop forwarding correctness, or policy intent.

BGP still needs:

- Hold Time / Keepalive (or BFD) for peer liveness beyond TCP alone.
- Policy (import/export, RPKI, max-prefix) for route control.
- Session protection (TCP-AO/MD5, GTSM) because TCP authenticity ≠ routing authenticity.
- Separate data-plane verification—Established never proves packets flow.

## Follow-ups

- What happens if Hold Time expires while TCP is still up?
- Why can MD5/AO sessions still exchange hijacked prefixes?
- How do Extended Messages relate to TCP’s stream model?

## Cross-links

[TCP 179](../04_Sessions_and_Transport/01_TCP_179.md), [Session authentication](../04_Sessions_and_Transport/05_Session_Authentication_and_GTSM.md).

---
