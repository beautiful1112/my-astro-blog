# TCP MD5 and TCP-AO

TCP MD5 (RFC 2385) authenticates TCP segments with a shared key and is widely deployed for BGP. It has weak key-management properties and operational rollover challenges.

TCP Authentication Option (TCP-AO, RFC 5925) provides stronger algorithm agility and key rollover design, but support is less universal.

Neither mechanism encrypts routing information or validates prefix ownership. Both protect the TCP session from unauthenticated injection/reset attempts when correctly configured.

Use unique managed keys, protected delivery, coordinated rotation, and tested failure procedures. A key mismatch normally leaves TCP unable to establish, which appears as a transport/session problem rather than a BGP policy problem.

---

