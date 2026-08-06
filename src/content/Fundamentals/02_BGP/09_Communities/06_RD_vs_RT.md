# Route Distinguisher vs Route Target

RD and RT solve different VPN problems:

| Item | Route Distinguisher | Route Target |
|---|---|---|
| Purpose | Makes an overlapping prefix globally unique in VPN NLRI | Controls VPN route import and export |
| Location | Part of the VPN NLRI | Extended community |
| Policy role | No inherent import policy | Explicit membership/policy signal |
| Typical notation | 65000:10 or 192.0.2.1:10 | target:65000:10 |

The RD creates different VPN routes such as two versions of 10.0.0.0/8. The RT decides which VRFs receive each version.

Using the same displayed number for both is an operational convention, not a protocol requirement. A route can have one RD and multiple RTs; changing the RD can affect BGP path diversity even when VPN membership stays the same.

---

