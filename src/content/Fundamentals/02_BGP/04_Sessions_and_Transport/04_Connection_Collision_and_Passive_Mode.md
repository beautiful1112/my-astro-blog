# Connection collision and passive mode

Both peers may initiate TCP simultaneously. BGP collision detection uses identifiers and connection state to retain one connection and close the other. Brief duplicate TCP sessions during establishment are therefore not necessarily a fault.

Passive mode prevents a peer from initiating while still accepting inbound connections. It can simplify firewall rules or route-server scaling, but both sides must not be passive unless an external mechanism initiates—otherwise the session remains Idle/Active forever.

---

