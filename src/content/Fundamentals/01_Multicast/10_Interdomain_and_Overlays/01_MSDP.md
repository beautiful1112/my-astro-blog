# Multicast Source Discovery Protocol

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

MSDP lets PIM-SM domains learn active IPv4 ASM sources. RPs exchange Source-Active messages over TCP port **639**. A receiving RP with local interest can join toward the advertised source.

Operational topics include SA origin/caching, peer-RPF loop prevention, default peers, and source/group filtering. MSDP does not carry user multicast data and is unnecessary for SSM. It is also commonly used to synchronize Anycast RP members.

