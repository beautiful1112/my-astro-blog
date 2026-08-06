# Cisco-Style BGP Inspection Examples

Common IOS/IOS XE-style commands include:

    show ip bgp summary
    show ip bgp neighbors 192.0.2.1
    show ip bgp 203.0.113.0/24
    show ip route 203.0.113.0 255.255.255.0
    show ip cef 203.0.113.1 detail
    show ip bgp neighbors 192.0.2.1 routes
    show ip bgp neighbors 192.0.2.1 advertised-routes

For other families, use the platform's address-family form, such as **show bgp ipv6 unicast** or **show bgp l2vpn evpn**.

Important: **received-routes** may require inbound soft reconfiguration and can mean pre-policy, while **routes** often means accepted routes. Exact syntax and semantics vary among IOS, IOS XE, IOS XR, and NX-OS releases; verify the target command reference.

---

