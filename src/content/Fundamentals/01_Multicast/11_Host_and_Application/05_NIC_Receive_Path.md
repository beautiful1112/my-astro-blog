# NIC receive path

```text
wire -> PHY/MAC -> NIC multicast filter -> RX descriptor ring
     -> driver/NAPI -> kernel stack -> socket receive queue
     -> application read -> decoder/order book
```

Drops can occur at every transition. A packet visible on an external TAP but absent from the application does not prove the network dropped it. Likewise, a normal OS capture may not see traffic consumed by kernel bypass.

