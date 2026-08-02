# Lab: Basic eBGP Origination

## Topology

R1 in AS 65001 connects directly to R2 in AS 65002.

## Objectives

- Establish IPv4-unicast eBGP.
- Originate one loopback /32 from each AS.
- Observe OPEN, KEEPALIVE, UPDATE, and AS_PATH prepend.

## Tasks

1. Configure addresses, local/remote ASN, and explicit import/export prefix policy.
2. Add an exact route for each originated loopback.
3. Confirm Established state and negotiated family.
4. Compare received, accepted, installed, and advertised views.
5. Capture TCP 179 and decode the first UPDATE.

## Failure injection

Remove R1's exact loopback route. Its advertisement should withdraw even though the BGP session stays Established.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
