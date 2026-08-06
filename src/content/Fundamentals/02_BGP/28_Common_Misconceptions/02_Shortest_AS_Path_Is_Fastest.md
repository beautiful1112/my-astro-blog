# Misconception: Shortest AS Path Is Fastest

AS_PATH counts administrative domains, not fiber distance, router hops, queueing, or latency. One ASN may span continents; several ASNs may share a local facility.

LOCAL_PREF can also make a longer path win before length is compared.

Use measured performance and explicit policy for latency intent. Treat AS_PATH as routing metadata and a rough policy signal, not a stopwatch.

---

