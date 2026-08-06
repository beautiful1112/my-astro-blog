# BGP Monitoring Protocol

BMP exports BGP monitoring data from routers to collectors without requiring the collector to become a routing peer.

Depending on capabilities, it can provide:

- Pre-policy and post-policy routes.
- Peer up/down events.
- Statistics.
- Route mirroring and local-RIB views.

BMP improves historical analysis of why a route changed, but it does not itself change routing policy. Collectors must handle high update volume and preserve timestamps and peer/family identity.

Protect the monitoring path because BMP exposes detailed topology and routing information.

---

