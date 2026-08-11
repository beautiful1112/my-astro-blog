# Split horizon

**Split horizon** in EIGRP prevents advertising a route out the interface on which it was learned. It reduces classical routing loops on multi-access segments. Default is enabled on most interfaces.

## When it blocks spoke-to-spoke

On a **multipoint** interface (mGRE DMVPN hub, Frame Relay multipoint, etc.), the hub learns Spoke-A’s prefix **in** on the multipoint interface. Split horizon then **suppresses** advertising that prefix **out** the same interface toward Spoke-B. Result: spokes cannot reach each other’s networks through the hub unless another path exists.

```text
Spoke-A ---(multipoint)--- Hub ---(multipoint)--- Spoke-B
Hub learns 10.1.1.0/24 from A on Tunnel0
Split horizon: do not advertise 10.1.1.0/24 out Tunnel0 → B never learns it
```

```text
Spoke A --> Hub multipoint
Spoke B --> H
H --blocked by SH--> B
```

## Disabling carefully

### Classic

```text
interface Tunnel0
 ip split-horizon eigrp 100
 ! to disable:
 no ip split-horizon eigrp 100
```

### Named

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  af-interface Tunnel0
   no split-horizon
  exit-af-interface
```

Disable **only** on the hub multipoint interface that must reflect spoke routes. Leaving split horizon enabled on point-to-point spokes is fine.

## Alternatives

- Point-to-point tunnels per spoke (no multipoint SH issue).
- NHRM/DMVPN phase designs with spoke-spoke shortcuts (data plane) plus control-plane design review.
- Separate hub interfaces per spoke (scales poorly).

## Risks

- `no split-horizon` on a LAN with mutual EIGRP routers can recreate loop conditions if other loop-prevention is weak—usually unnecessary on Ethernet p2p.
- Forgetting to disable on hub → “spoke cannot ping spoke” tickets.
- Disabling on wrong device (spoke) without understanding advertisement symmetry.

## Verification

```text
show ip eigrp topology 10.1.1.0/24   ! on Spoke-B
show running-config interface Tunnel0
```

## Interview framing

“Split horizon blocks advertising a prefix out its learning interface. On multipoint hubs that breaks spoke-to-spoke; disable SH on the hub multipoint AF interface only.”

## Related

- [Stub in hub and spoke](03_Stub_in_Hub_and_Spoke.md)
- [AF interface configuration](../13_Named_Mode_and_Configuration/03_AF_Interface_Configuration.md)

---
