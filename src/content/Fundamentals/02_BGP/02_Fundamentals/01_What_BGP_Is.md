# What BGP is

BGP-4 is the Internet's inter-Autonomous-System routing protocol. A BGP route pairs destination NLRI—normally an IP prefix—with path attributes describing reachability and policy. BGP exchanges routes incrementally over long-lived peer sessions.

BGP is often called a **path-vector** protocol: AS_PATH records the AS-level path, prevents inter-AS loops, and provides a policy input. BGP is not a shortest-path protocol in the OSPF/IS-IS sense. Operators can prefer a commercially or operationally desirable path over the numerically shortest one.

Base BGP supports destination-based forwarding. It advertises reachability; the router's RIB/FIB and recursive next-hop resolution determine actual packet forwarding.

---

