# Route Origination, Defaults, and Redistribution

A BGP network statement typically requires an exact matching route in the local RIB before originating the prefix; it does not create the route by itself.

Common origination methods:

- Network-style exact-prefix advertisement.
- Aggregation.
- Controlled redistribution.
- Conditional default origination.

Redistribution is dangerous because it can import a large, dynamic, or unintended route set. Apply explicit route maps, tags, prefix limits, and metric/origin handling.

Default-originate can create a dependency promise: the receiver may send all unknown traffic to you. Tie the advertisement to real upstream reachability if blackholing during failure is unacceptable.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
