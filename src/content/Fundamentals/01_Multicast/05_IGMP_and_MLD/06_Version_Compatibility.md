# IGMP version compatibility

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Compatibility is tracked in two directions:

- A host tracks the **oldest querier version** heard on each interface.
- A router tracks older-version listener presence, commonly per group.

## How query versions are recognized

| Wire observation | Interpreted query |
|---|---|
| 8 bytes, Max Resp field = 0 | IGMPv1 |
| 8 bytes, Max Resp field ≠ 0 | IGMPv2 |
| 12 bytes or more | IGMPv3 |

An IGMPv1 query's zero Max Resp field is interpreted by newer hosts as a 10-second response window.

## Host downgrade

- Hearing a v1 query places the interface into v1 compatibility mode and causes v1 reports.
- In the absence of v1 but presence of v2 queries, a v3 host uses v2 compatibility behavior.
- After the older-querier timer expires, the host can return to the newer version.

The oldest querier dominates because it must understand the reports.

## Router compatibility

When a v3 router hears a v1 or v2 report for group G, it must preserve behavior that serves that older listener. The router cannot assume that source-specific v3 state represents every listener.

Consequences include:

- Source filtering is lost for the affected compatibility scope.
- SSM intent may degrade into receive-from-all-sources behavior.
- v1 has no explicit leave, so removal relies on timeout.
- v2 leave processing can be used, but no source-specific pruning exists.

## Capture checklist

Do not trust configured version alone. Verify:

1. Query length and Max Resp field.
2. Actual report type (`0x12`, `0x16`, or `0x22`).
3. Whether v3 source lists are present.
4. Destination address and Router Alert.
5. Older-version timers or compatibility mode in device state.

An unexpected v1 report may come from a legacy host, an embedded appliance, or a switch/proxy translating membership.

