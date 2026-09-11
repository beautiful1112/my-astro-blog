# Leaf intent and guardrails

A rendered configuration is generated from a leaf intent model. The intent is the source of truth; the CLI is a projection.

## Leaf intent model

```yaml
hostname: leaf17
role: leaf
asn: 65117
router_id: 10.255.0.17
vtep_ip: 10.254.0.17
uplinks:
  - Ethernet1/49: spine01
  - Ethernet1/50: spine02
  - Ethernet1/51: spine03
  - Ethernet1/52: spine04
```

## Underlay guardrails

Minimum set:

```text
advertise: loopback /32 only
accept: infrastructure pools only
enable: ECMP + BFD
limit: maximum-prefix per neighbor
verify: LLDP ↔ intended cable map
avoid: redistribute connected
```

## Generated facts

These facts belong in automation, not in tribal memory:

- Leaf ASN = 65100 + rack ID.
- Router ID and VTEP loopbacks come from deterministic pools.
- Uplinks derive from leaf and spine IDs.

See [generated facts and change safety](../12_Automation/02_Generated_Facts_and_Change_Safety.md).

## Related

- [Underlay contract](01_Underlay_Contract.md)
- [Intent, evidence, rollback](../12_Automation/01_Intent_Evidence_Rollback.md)

---
