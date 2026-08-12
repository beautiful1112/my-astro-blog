# Segmentation

Segmentation is **controlled reachability**: VLAN, VRF, SGT, zone, tenant, Kubernetes network policy—different layers, same idea.

Pick the layer from the **enforcement need** and ops skill. VRF+FW is coarse and strong. SGT is finer but needs a policy plane. Do not run all of them with conflicting sources of truth.

```text
User/device identity
   -> group (SGT / ISE)
   -> VRF or VN
   -> firewall contract
```

OT/IoT: often **cannot** patch; segment hard and default-deny.

## Interview framing

“Segmentation is where packets are not allowed to go. I pick one primary model and a firewall at the seam—not five overlapping overlays.”

---
