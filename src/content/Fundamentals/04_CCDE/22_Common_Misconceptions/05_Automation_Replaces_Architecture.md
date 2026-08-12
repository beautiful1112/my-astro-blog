# Misconception: automation replaces architecture

## The myth

“If we have a controller and CI/CD, design does not matter.”

## Why it is wrong

Automation **amplifies** the architecture, including its blast radius. A pipeline can stretch a VLAN to 500 leaves faster than any human.

## Counterexample

One playbook, no canary, wrong VRF on all sites.

## Correct habit

Automate a modular design with a source of truth and a brake.

Related: [CI/CD](../17_Automation_and_Observability/03_CI_CD_for_Network.md).

---
