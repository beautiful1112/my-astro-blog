# Case 1: Same-VLAN multicast with no router

Sender and receivers in one VLAN can exchange IP multicast entirely at Layer 2. The sender maps `G` to a multicast MAC; receivers report; the switch replicates. PIM is unnecessary.

The hidden dependency is the querier. With snooping but no router or snooping querier, listener entries can age out. Provide an appropriate redundant querier.

