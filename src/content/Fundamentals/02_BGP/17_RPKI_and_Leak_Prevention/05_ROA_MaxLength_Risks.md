# ROA maxLength Risks

A ROA authorizes an origin ASN for a prefix and, via **maxLength**, optionally more-specific routes. maxLength is the most operationally mis-set ROA field.

## Too tight

If you announce `203.0.113.0/24` and `203.0.113.0/25` for TE/DDoS, but ROA maxLength is `/24`, the `/25` becomes **Invalid** under ROV and may be dropped by peers.

## Too loose

ROA `203.0.113.0/16-24 AS64500` authorizes any `/17`–`/24` from that ASN under the /16. An attacker who can somehow originate as AS64500 (or who compromises that ASN’s routing) gets a wide playground for more-specifics. Prefer **least permissive** authorization matching actual advertisements.

## Transition risk

Publishing a replacement ROA in the wrong order can temporarily invalidate active announcements:

1. Add new ROA that covers future announcements.
2. Wait for global VRP propagation.
3. Change BGP announcements.
4. Only then remove old ROA.

Never delete the only covering ROA before the new one is visible in validators.

## Inventory before enforcement

List:

- production aggregates;
- TE more-specifics;
- DDoS / RTBH host routes;
- anycast lengths;
- customer-reallocated space and their ROAs.

## Interactions

| Mechanism | Relationship |
|---|---|
| **RTBH /32** | Needs maxLength ≥ 32 or separate ROA |
| **Aggregation** | Components may need their own ROAs |
| **AS migration** | Dual-origin periods need dual ROAs |

## Verification

```text
# Compare announced prefixes vs VRPs
show bgp ipv4 unicast community-list …
whois -h rpki…   # or routinator VRPs
```

Lab: announce /25 with maxLength /24 → confirm Invalid.

## Interview framing

“maxLength that is too short breaks legitimate specifics; too long authorizes hijacked more-specifics from the same ASN—authorize only what you actually announce and stage ROA changes carefully.”

## Worked maxLength table

| ROA | Announcement | Result under ROV |
|---|---|---|
| `/24-24` | `/24` | Valid |
| `/24-24` | `/25` | Invalid |
| `/24-28` | `/28` | Valid |
| `/16-24` | `/20` | Valid (wide authorization) |
| `/24-32` | `/32` RTBH | Valid if same origin ASN |

## Change control snippet

Ticket must list: old ROA, new ROA, announcement plan, validator poll evidence, rollback (re-publish old ROA).

---
