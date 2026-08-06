# Interview: Why Does BGP Use TCP?

## Question

Why does BGP use TCP, and what does TCP not provide for BGP?

## Strong answer

BGP uses TCP port 179 for reliable, ordered delivery and retransmission, allowing BGP to focus on routing state and policy. TCP does not validate prefix authorization, AS-path truth, or forwarding reachability. BGP still needs Keepalives/Hold Time for peer liveness, policy for route control, and mechanisms such as TCP-AO/MD5 and GTSM for session protection.

## Follow-up

An Established TCP/BGP session proves neither address-family route exchange nor successful data-plane forwarding.

---

