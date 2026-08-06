# Define the exact multicast flow

Start every incident with:

```text
Environment/VRF:
Source S:
Group G:
UDP destination port:
Receiver/interface/VLAN:
ASM or SSM:
Expected RP for ASM:
Expected rate and TTL:
Feed session and expected sequence:
First known bad time:
```

“Multicast is down” is not a testable statement. Different flows can fail for different source, group, RP, ACL, scale, or application reasons.

