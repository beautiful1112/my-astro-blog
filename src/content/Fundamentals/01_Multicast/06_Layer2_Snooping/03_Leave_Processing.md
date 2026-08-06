# Layer-2 leave processing

On a host leave, snooping normally waits for group-specific query results before pruning. **Immediate leave/fast leave** removes the port at once and is safe only when exactly one listener is guaranteed behind that port.

Fast leave can black-hole other listeners behind a downstream switch, hypervisor, access point, or shared segment. Treat one physical port as shared unless architecture and enforcement prove otherwise.

