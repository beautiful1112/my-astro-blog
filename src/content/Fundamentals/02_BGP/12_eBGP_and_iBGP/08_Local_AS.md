# local-as (ASN migration and dual-AS peering)

`local-as` (Junos: `local-as`; Cisco: `neighbor local-as`) lets a BGP speaker peer using an ASN that differs from the process/router ASN. It is the primary tool for **ASN migrations**, merger of networks, and temporary dual-homing under old and new ASNs.

## Problems it solves

1. **ASN renumbering:** Peers still neighbor to the old ASN while the local process already runs the new ASN.
2. **Mergers:** Two former ASes consolidate under one process ASN but must keep legacy peerings alive.
3. **Vendor / IX constraints:** A route-server or upstream still expects the historical ASN on the OPEN.

## Common behavioral knobs

Exact names differ; conceptually:

| Knob | Effect |
|---|---|
| **local-as \<ASN\>** | Use alternate ASN in OPEN / AS_PATH toward that peer. |
| **no-prepend** | Do not prepend the local-as value in addition to the real ASN (avoids doubling path length). |
| **replace-as** / **dual-as** variants | Control whether the real process ASN, the local-as, or both appear in AS_PATH. |
| **dual-as** (where available) | Allow the peer to open with either ASN during migration. |

Misunderstanding prepend behavior is the usual outage cause: traffic suddenly prefers another upstream because AS_PATH grew by one unexpected ASN.

## Path and OPEN interactions

```text
Process ASN (router):     64500   (new)
local-as toward peer:     64496   (old)
Peer remote-as:           64496 expected on their side for our OPEN
```

Depending on options, AS_PATH exported to the Internet might show:

- `64496` only (replace-style migration),
- `64500 64496` (both visible),
- or `64500` only after migration completes and local-as is removed.

iBGP inside the AS should generally use the real process ASN consistently; local-as is almost always an **eBGP peer** exception.

## Configuration patterns

### Cisco IOS XE

```text
router bgp 64500
 neighbor 192.0.2.1 remote-as 64497
 neighbor 192.0.2.1 local-as 64496 no-prepend replace-as
 neighbor 192.0.2.1 activate
```

Interpret `no-prepend` / `replace-as` against the exact IOS train documentation before production use; combinations change what the peer and the global Internet see.

### Junos

```text
set protocols bgp group UPSTREAM local-as 64496 private
set protocols bgp group UPSTREAM peer-as 64497
set protocols bgp group UPSTREAM neighbor 192.0.2.1
```

`private` local-as typically hides the local-as from AS_PATH advertisements in ways analogous to Cisco’s replace/no-prepend family—confirm on the running code.

## Migration playbook

1. Originate prefixes from the new ASN with coordinated IRR/RPKI updates.
2. Add local-as on legacy peerings; verify OPEN and received routes.
3. Move IRR `origin` / ROAs to the new ASN; watch Invalids.
4. Ask peers to change `peer-as` to the new ASN.
5. Remove local-as; confirm AS_PATH length and preferred exits unchanged.
6. Only then decommission dual routing policy.

## Verification

```text
show bgp neighbors 192.0.2.1 | include local AS|remote AS|Local AS
show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
```

Capture an OPEN on both sides during change windows. Confirm:

- negotiated capabilities unchanged;
- AS_PATH length to critical peers matches the migration plan;
- RPKI validation state for originated prefixes remains Valid.

## Risks

- Leaving local-as permanently creates confusing telemetry and IRR mismatch.
- Wrong prepend options cause unexpected inbound shifts.
- Route reflectors and confederations add another ASN layer—draw the AS_PATH before and after on paper.

## Related topics

- [Private ASNs and remove-private-AS](../03_ASNs_and_Peering/04_Private_ASNs_and_Remove_Private_AS.md)
- [Four-Octet ASN Path Handling](../08_Path_Attributes/05_Four_Octet_AS_Path_Handling.md)
- [as-override](07_AS_Override.md) — different problem (VPN same-ASN CE sites)

---
