# Autonomous System numbers

Original BGP encoded two-octet ASNs. RFC 6793 adds four-octet ASNs while interoperating with older speakers through `AS_TRANS` (23456), `AS4_PATH`, and `AS4_AGGREGATOR` reconstruction.

Presentation formats include plain integer/asplain, such as `4200000001`, and historical asdot notation. Prefer unambiguous asplain in automation.

Private-use ranges are intended for closed routing domains and must normally be removed before Internet advertisement. AS 0 is reserved and must not appear in valid AS_PATH advertisements.

---

