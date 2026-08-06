# FRRouting Inspection Examples

Common FRR commands include:

    show bgp summary
    show bgp neighbors 192.0.2.1
    show bgp ipv4 unicast 203.0.113.0/24
    show bgp ipv4 unicast neighbors 192.0.2.1 routes
    show bgp ipv4 unicast neighbors 192.0.2.1 advertised-routes
    show ip route 203.0.113.0/24

JSON output is valuable for automation:

    show bgp summary json
    show bgp ipv4 unicast 203.0.113.0/24 json

Use the exact FRR release documentation because command forms and JSON schemas evolve. When scripting, validate missing keys and multiple paths rather than parsing human-formatted columns.

---

