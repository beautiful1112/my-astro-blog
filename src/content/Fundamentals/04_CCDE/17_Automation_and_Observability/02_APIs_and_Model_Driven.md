# APIs and model-driven management

SNMP/CLI do not scale as a source of truth. Model-driven (YANG, NETCONF, RESTCONF, gNMI) and REST APIs let automation **encode the HLD**.

Design: which models are authoritative, how auth works, rate limits, and how you avoid dual-writing CLI + API.

Ansible/Terraform are **tools**; the design is the **inventory and intent model**. Pick tools from staff constraint.

## Interview framing

“Automation needs a model and a source of truth. I choose APIs because they encode the design, not because YAML is fashionable.”

---
