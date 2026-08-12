# Internet edge and multihoming

Internet edge is **security + BGP policy + HA**.

- Dual firewalls or equivalent, but watch **state and asymmetry**
- Dual ISPs with true independence
- Default vs partial vs full table from RTO/TE need
- Inbound: NAT, DNS, reverse path; outbound: default + filters
- DDoS: on-prem only vs provider/cloud scrubbing (cost vs RTO)

Single “HA pair” on one upstream is not multihoming.

## Interview framing

“Multihoming is two providers, two paths, and BGP policy that will not transit. An HA pair on one ISP is just a nicer CPE.”

---
