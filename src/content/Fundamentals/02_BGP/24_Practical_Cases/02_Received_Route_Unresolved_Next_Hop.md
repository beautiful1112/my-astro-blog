# Case: Received Route with an Unresolved Next Hop

## Symptom

203.0.113.0/24 appears in BGP but is not installed.

## Reasoning

The route was received and accepted. Its next hop, 192.0.2.9, is preserved from an edge iBGP speaker and is absent from the IGP.

## Proof

The detailed BGP path shows the next hop as inaccessible. A route lookup for 192.0.2.9 fails.

## Correction

Either advertise the external subnet into the underlay or apply next-hop-self at the correct boundary. Verify recursive resolution and FIB installation.

## Lesson

The reachability of the destination depends on reachability of the BGP next hop.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
