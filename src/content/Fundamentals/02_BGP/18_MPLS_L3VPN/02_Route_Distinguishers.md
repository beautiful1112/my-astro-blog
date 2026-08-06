# Route Distinguishers in L3VPN

An RD prepended to a customer prefix creates unique VPN NLRI. Two VRFs can both advertise 10.0.0.0/8 because different RDs produce different VPN routes.

RD design affects path diversity:

- If two PEs advertise the same prefix with the same RD, BGP may select one VPN path before another PE sees both.
- Unique per-PE RDs can preserve distinct NLRI and improve multipath or backup visibility.

An RD does not decide which VRF imports a route. Route targets do that.

---

