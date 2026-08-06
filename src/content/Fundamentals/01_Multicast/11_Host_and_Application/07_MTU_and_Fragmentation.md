# MTU and fragmentation

Avoid IP fragmentation for market data:

- one missing fragment loses the complete datagram;
- fragments may be filtered or slow-pathed;
- reassembly costs state and latency;
- IPv6 routers never fragment in transit;
- UDP has no TCP-like MSS negotiation.

Keep payload below the minimum path MTU after VLAN and tunnel overhead. Verify actual frame sizes instead of trusting interface MTU alone.

