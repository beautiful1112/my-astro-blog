# IGMPv3 report size, packing, and MTU behavior

IGMPv3 Reports are variable because they can bundle many groups and sources.

## Size formulas

- Report header: **8 bytes**.
- Group Record with N sources and no auxiliary data: **8 + 4N bytes**.
- Complete report: **8 + sum of all Group Record lengths**.

At Ethernet MTU 1500 with a 24-byte IPv4 header containing Router Alert, at most **1476 bytes** remain for IGMP.

## Packing rules

The sender packs as many complete Group Records as fit within the report size limit.

If one record has too many sources:

- Most record types may be split into multiple records across Report messages.
- MODE_IS_EXCLUDE and CHANGE_TO_EXCLUDE_MODE are not split in the same way; the sender includes as many sources as fit and omits the remainder.

This conservative exception avoids accidentally reporting an incomplete EXCLUDE list as if the receiver had intentionally allowed the omitted sources under normal split semantics.

## Operational implications

- A single host state change can produce multiple IGMP packets.
- A capture must collect every packet in the burst before concluding sources are absent.
- Control-plane policers and snooping hardware must handle large reports.
- Source-list scale can increase CPU and state even when group count is small.
- IP fragmentation should not be the design mechanism for oversized reports; the protocol packing rules keep messages within the interface MTU.

Primary reference: [RFC 3376, Section 4.2.16](https://www.rfc-editor.org/rfc/rfc3376.html#section-4.2.16).

