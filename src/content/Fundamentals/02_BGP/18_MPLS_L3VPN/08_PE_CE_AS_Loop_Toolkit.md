# PE-CE AS-Loop Toolkit (allowas-in, as-override, SoO)

L3VPN and VRF PE-CE designs often break the assumptions behind classic eBGP AS_PATH loop prevention. Three tools appear together in almost every same-ASN or dual-homed CE design review. Use this page as the map; each tool has a dedicated deep-dive.

## The failure mode

```text
CE-A (AS 65001) ---- PE-1 ==== MPLS/VPN ==== PE-2 ---- CE-B (AS 65001)
```

Route from CE-A reaches CE-B with `AS_PATH: 65001`. CE-B rejects it as an AS loop. Dual-homing the *same* CE to two PEs creates a second failure: the site learns its own prefix back via the VPN and hairpins.

## Tool choice

| Goal | Prefer | Where configured |
|---|---|---|
| Let same-ASN remote sites accept VPN routes | **as-override** on PE→CE | PE outbound |
| Same goal, but change the CE instead | **allowas-in** on CE (or PE inbound) | Receiver |
| Stop a site from learning its own prefixes via VPN | **Site-of-Origin** | PE per CE attachment |
| Avoid the problem entirely | Unique ASN per site | Design |
| Extra PE identity tricks | **local-as** | PE neighbor—migration |
| Preserve external NH across RS/VPN edges | **next-hop-unchanged** | Selective; not a loop tool |

Provider-managed CE environments usually pick **as-override + SoO** so customer routers stay simple. Customer-managed CEs that refuse PE overrides may require **allowas-in + SoO**.

## Minimum safe combo

```text
as-override (or allowas-in)
        +
Site-of-Origin per site
        +
Ordinary PE-CE prefix filters
```

as-override / allowas-in without SoO is incomplete. SoO without one of the AS-loop relaxations does not help two sites that share an ASN accept each other’s routes.

## Detailed references

- [allowas-in](../12_eBGP_and_iBGP/06_AllowAS_In.md)
- [as-override](../12_eBGP_and_iBGP/07_AS_Override.md)
- [local-as](../12_eBGP_and_iBGP/08_Local_AS.md)
- [next-hop-unchanged](../12_eBGP_and_iBGP/09_Next_Hop_Unchanged.md)
- [Site-of-Origin](07_Site_of_Origin.md)
- [eBGP Advertisement and AS Loops](../12_eBGP_and_iBGP/01_eBGP_Advertisement_and_AS_Loops.md)

## Configuration reminder (PE)

```text
router bgp 65000
 address-family ipv4 vrf CUST
  neighbor 192.0.2.10 remote-as 65001
  neighbor 192.0.2.10 activate
  neighbor 192.0.2.10 as-override
  neighbor 192.0.2.10 site-of-origin 65000:1001
  neighbor 192.0.2.10 prefix-list CUST-IN in
```

## Lab checklist

1. Two CEs, same ASN, one prefix each: without override/allowas-in → rejected; with tool → accepted.
2. Dual-homed site: without SoO → site prefix learned via BGP from PE; with SoO → suppressed.
3. Confirm Internet VRFs / global table peers do **not** inherit as-override.
4. Capture AS_PATH on CE before/after override; capture extended communities for SoO.
5. Negative test: remove SoO with override enabled and observe hairpin risk.

## Interview framing

“Same-ASN L3VPN sites need as-override or allowas-in to accept each other’s routes, and SoO so a site does not learn its own prefixes back from the VPN—use them as a pair.”

---
