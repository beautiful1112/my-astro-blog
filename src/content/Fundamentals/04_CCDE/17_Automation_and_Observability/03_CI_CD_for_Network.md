# CI/CD for the network

CI/CD means **validate then push in small batches** with rollback—not a Friday script as root.

Pipeline sketch:

```text
intent repo -> lint/simulate/peer review -> canary site -> rest -> assurance
```

Blast radius: a pipeline that hits 2000 sites at once is a weapon. Match change size to Agile vs Waterfall constraint.

IaC tools (Jenkins/GitLab, Ansible, Terraform) appear on the v3.1 list as **awareness of when to use**, not CCIE-level coding.

## Interview framing

“Network CI/CD is small validated pushes with rollback and canaries. A global play without a brake is not automation—it is a faster outage.”

---
