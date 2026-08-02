# Large Communities

RFC 8092 large communities contain three unsigned 32-bit values:

**Global Administrator : Local Data Part 1 : Local Data Part 2**

They were designed partly because standard communities cannot naturally encode a four-octet ASN plus a useful operator value. A common convention is:

- Global administrator = operator ASN.
- Data 1 = function or region.
- Data 2 = parameter.

Large communities are optional transitive and must be compared exactly. Their semantics remain operator-defined.

Example design: **64500:100:20** could mean “ingress region 100, preference class 20,” but it has no universal meaning. Publish a registry and avoid overloading the same value across unrelated functions.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
